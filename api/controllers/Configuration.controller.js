import ConfigurationModel from "../models/Configuration.model.js";
import ProductModel from "../models/Product.model.js";
import CartModel from "../models/Cart.model.js";
import { addItemToCart } from "./Cart.controller.js";

import { signProduct, signProducts } from "../s3.js";

const REQUIRED_SINGLE_SLOTS = ["processor", "motherboard", "psu"];
const OPTIONAL_SINGLE_SLOTS = ["gpu", "case"];
const ARRAY_SLOTS = ["ram", "storage"];

async function resolveAndValidateParts(partsInput) {
  for (const slot of REQUIRED_SINGLE_SLOTS) {
    if (!partsInput?.[slot]) {
      throw new Error(`Missing required part: ${slot}`);
    }
  }
  for (const slot of ARRAY_SLOTS) {
    if (!partsInput?.[slot]?.length) {
      throw new Error(
        `At least one ${slot === "ram" ? "RAM stick" : "storage drive"} is required`,
      );
    }
  }

  const idsBySlot = [];
  for (const slot of [...REQUIRED_SINGLE_SLOTS, ...OPTIONAL_SINGLE_SLOTS]) {
    if (partsInput[slot]) idsBySlot.push({ id: partsInput[slot], type: slot });
  }
  for (const slot of ARRAY_SLOTS) {
    partsInput[slot].forEach((id) => idsBySlot.push({ id, type: slot }));
  }

  const ids = idsBySlot.map((entry) => entry.id);
  const products = await ProductModel.find({ _id: { $in: ids } });
  const productById = new Map(products.map((p) => [p._id.toString(), p]));

  for (const { id, type } of idsBySlot) {
    const product = productById.get(id.toString());
    if (!product) {
      throw new Error(`Product ${id} not found`);
    }
    if (product.type !== type) {
      throw new Error(
        `Product ${id} is type "${product.type}", expected "${type}" for slot ${type}`,
      );
    }
  }
}

async function populateAndSignConfiguration(id) {
  const configuration = await ConfigurationModel.findById(id)
    .populate("parts.processor parts.motherboard parts.gpu parts.psu parts.case")
    .populate("parts.ram parts.storage")
    .populate("author", "username")
    .populate("clonedFrom", "name");

  if (!configuration) return null;

  const plain = configuration.toObject();

  const signSlot = async (product) => (product ? await signProduct(product) : null);

  const [processor, motherboard, gpu, psu, caseProduct, ram, storage] =
    await Promise.all([
      signSlot(plain.parts.processor),
      signSlot(plain.parts.motherboard),
      signSlot(plain.parts.gpu),
      signSlot(plain.parts.psu),
      signSlot(plain.parts.case),
      signProducts(plain.parts.ram.filter(Boolean)),
      signProducts(plain.parts.storage.filter(Boolean)),
    ]);

  const totalPrice = [processor, motherboard, gpu, psu, caseProduct, ...ram, ...storage]
    .filter(Boolean)
    .reduce((sum, product) => sum + (product.price || 0), 0);

  return {
    ...plain,
    parts: { processor, motherboard, gpu, psu, case: caseProduct, ram, storage },
    totalPrice,
  };
}

async function attachListTotals(configs) {
  const idSet = new Set();
  for (const config of configs) {
    const { ram, storage } = config.parts;
    ram.forEach((partId) => idSet.add(partId.toString()));
    storage.forEach((partId) => idSet.add(partId.toString()));
  }

  const products = await ProductModel.find({ _id: { $in: [...idSet] } }, "price");
  const priceById = new Map(products.map((p) => [p._id.toString(), p.price || 0]));

  return configs.map((config) => {
    const { processor, motherboard, psu, gpu, case: caseProduct, ram, storage } =
      config.parts;
    const singlePartsPrice =
      (processor?.price || 0) +
      (motherboard?.price || 0) +
      (psu?.price || 0) +
      (gpu?.price || 0) +
      (caseProduct?.price || 0);
    const ramStoragePrice = [...ram, ...storage].reduce(
      (sum, partId) => sum + (priceById.get(partId.toString()) || 0),
      0,
    );

    return { ...config, totalPrice: singlePartsPrice + ramStoragePrice };
  });
}

export async function getConfigurations(req, res) {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (search) filter.name = new RegExp(search, "i");

    const skip = (Number(page) - 1) * Number(limit);

    const [configs, total] = await Promise.all([
      ConfigurationModel.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .populate("parts.processor parts.motherboard parts.gpu parts.psu parts.case", "name images price")
        .populate("author", "username")
        .lean(),
      ConfigurationModel.countDocuments(filter),
    ]);

    const signSlot = async (product) => (product ? await signProduct(product) : null);

    const signedConfigs = await Promise.all(
      configs.map(async (config) => {
        const [processor, motherboard, gpu, psu, caseProduct] = await Promise.all([
          signSlot(config.parts.processor),
          signSlot(config.parts.motherboard),
          signSlot(config.parts.gpu),
          signSlot(config.parts.psu),
          signSlot(config.parts.case),
        ]);

        return {
          ...config,
          parts: { ...config.parts, processor, motherboard, gpu, psu, case: caseProduct },
        };
      }),
    );

    const configurations = await attachListTotals(signedConfigs);

    res.status(200).json({
      configurations,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getConfiguration(req, res) {
  try {
    const configuration = await populateAndSignConfiguration(req.params.id);
    if (!configuration)
      return res.status(404).json({ error: "Configuration not found" });

    res.status(200).json({ configuration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createConfiguration(req, res) {
  try {
    const { name, description, parts } = req.body;

    await resolveAndValidateParts(parts);

    const configuration = await ConfigurationModel.create({
      name,
      description,
      parts,
      author: req.user._id,
      clonedFrom: null,
    });

    res.status(201).json({ configuration: { _id: configuration._id } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateConfiguration(req, res) {
  try {
    const configuration = await ConfigurationModel.findById(req.params.id);
    if (!configuration)
      return res.status(404).json({ error: "Configuration not found" });
    if (configuration.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (req.body.parts !== undefined) {
      await resolveAndValidateParts(req.body.parts);
    }

    const allowed = ["name", "description", "parts"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        configuration[field] = req.body[field];
      }
    });

    await configuration.save();
    res.status(200).json({ configuration: { _id: configuration._id } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteConfiguration(req, res) {
  try {
    const configuration = await ConfigurationModel.findById(req.params.id);
    if (!configuration)
      return res.status(404).json({ error: "Configuration not found" });
    if (configuration.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this configuration" });
    }

    await configuration.deleteOne();
    res.status(200).json({ message: "Configuration deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function cloneConfiguration(req, res) {
  try {
    const source = await ConfigurationModel.findById(req.params.id);
    if (!source)
      return res.status(404).json({ error: "Configuration not found" });

    const clone = await ConfigurationModel.create({
      name: req.body.name ?? `${source.name} (copy)`,
      description: source.description,
      parts: source.parts,
      author: req.user._id,
      clonedFrom: source._id,
    });

    const configuration = await populateAndSignConfiguration(clone._id);
    res.status(201).json({ configuration });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function buyConfiguration(req, res) {
  try {
    const configuration = await ConfigurationModel.findById(req.params.id);
    if (!configuration)
      return res.status(404).json({ error: "Configuration not found" });

    const { processor, motherboard, gpu, psu, case: caseId, ram, storage } =
      configuration.parts;
    const productIds = [processor, motherboard, gpu, psu, caseId, ...ram, ...storage].filter(
      Boolean,
    );

    let cart = await CartModel.findOne({ user: req.user._id });
    if (!cart) {
      cart = new CartModel({ user: req.user._id, items: [] });
    }

    const products = await ProductModel.find({ _id: { $in: productIds } });
    const productById = new Map(products.map((p) => [p._id.toString(), p]));

    for (const productId of productIds) {
      const product = productById.get(productId.toString());
      if (!product) continue;
      addItemToCart(cart, productId, 1, product);
    }

    await cart.save();
    await cart.populate("items.product", "name images price stock");
    const productsForSigning = cart.items.map((item) => item.product.toObject());
    const signedProducts = await signProducts(productsForSigning);
    cart.items.forEach((item, i) => (item.product = signedProducts[i]));

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
