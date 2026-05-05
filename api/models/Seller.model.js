import mongoose from "mongoose";

const exclusionsSchema = new mongoose.Schema(
  {
    misuse: { type: Boolean, default: true },
    unauthorizedRepairs: { type: Boolean, default: true },
    wearAndTear: { type: Boolean, default: true },
    consumables: { type: Boolean, default: true },
    cosmetic: { type: Boolean, default: false },
  },
  { _id: false },
);

export const warrantySchema = new mongoose.Schema(
  {
    durationMonths: { type: Number, enum: [24, 36, 60], required: true },
    accidentalDamage: { type: Boolean, default: false },
    wearAndTear: { type: Boolean, default: false },
    resolution: {
      type: String,
      enum: ["repair", "repair_replace", "full"],
      required: true,
    },
    shipping: { type: String, enum: ["buyer", "seller"], required: true },
    exclusions: { type: exclusionsSchema, default: () => ({}) },
  },
  { _id: false },
);

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      zip: { type: String, required: true },
    },
    warranty: { type: warrantySchema, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Seller", sellerSchema);
