import OrderModel from "../models/Order.model.js";
import ProductModel from "../models/Product.model.js";
import CartModel from "../models/Cart.model.js";

export async function getOrders(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = { buyer: req.user._id };

    const [orders, total] = await Promise.all([
      OrderModel.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .populate("items.product", "name images"),
      OrderModel.countDocuments(filter),
    ]);

    res.status(200).json({
      orders,
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

export async function getOrder(req, res) {
  try {
    const order = await OrderModel.findById(req.params.id).populate(
      "items.product",
      "name images",
    );

    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.buyer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createOrder(req, res) {
  try {
    const { address } = req.body;

    const cart = await CartModel.findOne({ user: req.user._id });
    if (!cart || !cart.items.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const products = await Promise.all(
      cart.items.map(({ product }) => ProductModel.findById(product)),
    );

    const orderItems = cart.items.map(({ product, quantity }, i) => {
      const doc = products[i];
      if (!doc) {
        throw new Error(`Product ${product} not found`);
      }
      if (doc.stock < quantity) {
        throw new Error(`Insufficient stock for ${doc.name}`);
      }
      return {
        quantity,
        product: {
          _id: doc._id,
          name: doc.name,
          images: doc.images,
          price: doc.price,
        },
      };
    });

    const total = orderItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    await Promise.all([
      ...orderItems.map(({ product, quantity }) =>
        ProductModel.findByIdAndUpdate(product._id, {
          $inc: { stock: -quantity },
        }),
      ),
      cart.deleteOne(),
    ]);

    const order = await OrderModel.create({
      buyer: req.user._id,
      items: orderItems,
      shippingAddress: address,
      total,
    });

    res.status(201).json({ order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    // if (order.buyer.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ error: "Not authorized" });
    // }
    // TODO: edit who can change order status

    if (order.status !== "cancelled") {
      await Promise.all(
        order.items.map(({ product, quantity }) =>
          ProductModel.findByIdAndUpdate(product, {
            $inc: { stock: quantity },
          }),
        ),
      );
    }

    order.status = req.body.status;
    await order.save();
    res.status(200).json({ order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteOrder(req, res) {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this order" });
    }
    await order.deleteOne();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
