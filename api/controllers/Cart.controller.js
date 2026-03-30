import CartModel from "../models/Cart.model.js";
import ProductModel from "../models/Product.model.js";
import { signProducts } from "../s3.js";

export async function getCart(req, res) {
  try {
    const cart = await CartModel.findOne({ user: req.user._id }).populate(
      "items.product",
      "name images price stock",
    );
    const products = cart.items.map((item) => item.product.toObject());
    const signedProducts = await signProducts(products);
    cart.items.forEach((item, i) => (item.product = signedProducts[i]));

    res.status(200).json({ cart: cart ?? { items: [] } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addToCart(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    let cart = await CartModel.findOne({ user: req.user._id });
    if (!cart) {
      cart = new CartModel({ user: req.user._id, items: [] });
    }

    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      const trueQuantity = Math.min(quantity, product.stock);
      if (trueQuantity <= 0)
        return res.status(400).json({ error: "Item out of stock" });
      cart.items.push({ product: productId, quantity: trueQuantity });
    }

    await cart.save();
    await cart.populate("items.product", "name images price stock");
    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateCartItem(req, res) {
  try {
    const { quantity } = req.body;
    const cart = await CartModel.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    const item = cart.items.find((i) => i.product.toString() === req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.product.toString() !== req.params.id,
      );
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    await cart.populate("items.product", "name images price stock");
    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function removeFromCart(req, res) {
  try {
    const cart = await CartModel.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId,
    );
    await cart.save();
    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
