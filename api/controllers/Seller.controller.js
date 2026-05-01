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
