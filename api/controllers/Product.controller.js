import ProductModel from "../models/Product.model.js";
import ReviewModel from "../models/Review.model.js";
import { Types } from "mongoose";

import { signProduct, signProducts, uploadFiles, deleteFiles } from "../s3.js";

export async function getProducts(req, res) {
  try {
    const {
      type,
      brand,
      condition,
      minPrice,
      maxPrice,
      search,
      seller,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (brand) filter.brand = new RegExp(brand, "i");
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter["price"] = {};
      if (minPrice) filter["price"].$gte = Number(minPrice);
      if (maxPrice) filter["price"].$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };
    if (seller) filter.seller = seller;

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      ProductModel.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .populate("seller", "username firstName lastName"),
      ProductModel.countDocuments(filter),
    ]);
    const productsWithImages = await signProducts(
      products.map((p) => p.toObject()),
    );

    res.status(200).json({
      products: productsWithImages,
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

export async function getProduct(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [product, reviews, total, ratingData] = await Promise.all([
      ProductModel.findById(req.params.id).populate(
        "seller",
        "username firstName lastName",
      ),
      ReviewModel.find({ product: req.params.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("author", "username firstName lastName"),
      ReviewModel.countDocuments({ product: req.params.id }),
      ReviewModel.aggregate([
        { $match: { product: new Types.ObjectId(req.params.id) } },
        { $group: { _id: null, average: { $avg: "$rating" } } },
      ]),
    ]);

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({
      product: await signProduct(product.toObject()),
      reviews,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      rating: ratingData[0]?.average ?? 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export async function createProduct(req, res) {
  try {
    const imageKeys = await uploadFiles(req.files, "products");
    const product = await ProductModel.create({
      ...req.body,
      images: imageKeys,
      specs: JSON.parse(req.body.specs),
      seller: req.user._id,
    });

    res.status(201).json({ product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
export async function updateProduct(req, res) {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const existingUrls = JSON.parse(req.body.existingImages ?? "[]");
    const removedKeys = product.images.filter(
      (key) => !existingUrls.some((url) => url.includes(key)),
    );

    if (removedKeys.length) await deleteFiles(removedKeys);

    const newKeys = req.files?.length
      ? await uploadFiles(req.files, "products")
      : [];

    const keptKeys = product.images.filter((key) =>
      existingUrls.some((url) => url.includes(key)),
    );
    product.images = [...keptKeys, ...newKeys];

    const allowed = ["name", "price", "stock", "condition", "tags", "specs"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field == "specs") {
          product[field] = JSON.parse(req.body[field]);
        } else {
          product[field] = req.body[field];
        }
      }
    });

    await product.save();
    res.status(200).json({ product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this product" });
    }

    await deleteFiles(product.images);
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
