import UserModel from "../models/User.model.js";
import SellerModel from "../models/Seller.model.js";

export async function upsertSellerInfo(req, res) {
  try {
    const seller = await SellerModel.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, verified: false, user: req.user._id },
      { new: true, upsert: true, runValidators: true },
    );
    res.status(200).json({ seller });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getSellerInfo(req, res) {
  try {
    const seller = await SellerModel.findOne({ user: req.user._id });
    if (!seller)
      return res.status(404).json({ error: "Seller info not found" });
    res.status(200).json({ seller });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getSellerInfoById(req, res) {
  try {
    const seller = await SellerModel.findOne({ user: req.params.id }).populate(
      "user",
      "username firstName lastName",
    );
    if (!seller) return res.status(404).json({ error: "Seller not found" });
    res.status(200).json({ seller });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getUnverifiedSellers(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [sellers, total] = await Promise.all([
      SellerModel.find({ verified: false })
        .skip(skip)
        .limit(Number(limit))
        .populate("user", "username firstName lastName"),
      SellerModel.countDocuments({ verified: false }),
    ]);

    res.status(200).json({
      sellers,
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

export async function verifySeller(req, res) {
  try {
    const seller = await SellerModel.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true },
    ).populate("user", "username firstName lastName");

    if (!seller) return res.status(404).json({ error: "Seller not found" });

    await UserModel.findByIdAndUpdate(seller.user._id, {
      $addToSet: { roles: "seller" },
    });

    res.status(200).json({ seller });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function rejectSeller(req, res) {
  try {
    const seller = await SellerModel.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    await Promise.all([
      seller.deleteOne(),
      UserModel.findByIdAndUpdate(seller.user, {
        $pull: { roles: "seller" },
      }),
    ]);

    res.status(200).json({ message: "Seller rejected successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
