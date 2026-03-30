import CartModel from "../models/Cart.modlel.js";
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
    let cart = await CartModel.findOne({ user: req.user._id });
    if (!cart) {
      cart = new CartModel({ user: req.user._id, items: [] });
    }
    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
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
    const item = cart.items.find(
      (i) => i.product.toString() === req.params.productId,
    );
    if (!item) return res.status(404).json({ error: "Item not found" });
    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.product.toString() !== req.params.productId,
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
