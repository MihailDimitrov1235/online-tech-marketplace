import OrderModel from "../models/Order.model.js";
import ProductModel from "../models/Product.model.js";
import UserModel from "../models/User.model.js";
import SellerModel from "../models/Seller.model.js";
import mongoose from "mongoose";

export async function getStats(req, res) {
  try {
    const roles = req.user.roles;
    const stats = {};

    await Promise.all(
      [
        roles.includes("buyer") &&
          (async () => {
            const [totalOrders, pendingOrders, spentResult] = await Promise.all(
              [
                OrderModel.countDocuments({ buyer: req.user._id }),
                OrderModel.countDocuments({
                  buyer: req.user._id,
                  status: "pending",
                }),
                OrderModel.aggregate([
                  {
                    $match: {
                      buyer: new mongoose.Types.ObjectId(req.user._id),
                    },
                  },
                  { $group: { _id: null, total: { $sum: "$total" } } },
                ]),
              ],
            );
            stats.buyer = {
              totalOrders,
              pendingOrders,
              totalSpent: spentResult[0]?.total ?? 0,
            };
          })(),

        roles.includes("seller") &&
          (async () => {
            const sellerId = new mongoose.Types.ObjectId(req.user._id);
            const [totalOrders, pendingOrders, revenueResult, totalProducts] =
              await Promise.all([
                OrderModel.countDocuments({ "items.product.seller": sellerId }),
                OrderModel.countDocuments({
                  "items.product.seller": sellerId,
                  status: "pending",
                }),
                OrderModel.aggregate([
                  { $match: { "items.product.seller": sellerId } },
                  { $unwind: "$items" },
                  { $match: { "items.product.seller": sellerId } },
                  {
                    $group: {
                      _id: null,
                      total: {
                        $sum: {
                          $multiply: [
                            "$items.product.price",
                            "$items.quantity",
                          ],
                        },
                      },
                    },
                  },
                ]),
                ProductModel.countDocuments({ seller: req.user._id }),
              ]);
            stats.seller = {
              totalOrders,
              pendingOrders,
              totalRevenue: revenueResult[0]?.total ?? 0,
              totalProducts,
            };
          })(),

        roles.includes("delivery") &&
          (async () => {
            const [assigned, inProgress, delivered] = await Promise.all([
              OrderModel.countDocuments({ delivery: req.user._id }),
              OrderModel.countDocuments({
                delivery: req.user._id,
                status: "shipped",
              }),
              OrderModel.countDocuments({
                delivery: req.user._id,
                status: "delivered",
              }),
            ]);
            stats.delivery = { assigned, inProgress, delivered };
          })(),

        roles.includes("admin") &&
          (async () => {
            const [
              totalUsers,
              pendingVerifications,
              totalOrders,
              totalProducts,
            ] = await Promise.all([
              UserModel.countDocuments(),
              SellerModel.countDocuments({ verified: false }),
              OrderModel.countDocuments(),
              ProductModel.countDocuments(),
            ]);
            stats.admin = {
              totalUsers,
              pendingVerifications,
              totalOrders,
              totalProducts,
            };
          })(),
      ].filter(Boolean),
    );

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
