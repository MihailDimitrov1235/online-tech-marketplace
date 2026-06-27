import mongoose from "mongoose";

const partsSchema = new mongoose.Schema(
  {
    processor: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
    motherboard: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
    psu: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
    gpu: { type: mongoose.Schema.ObjectId, ref: "Product", default: null },
    case: { type: mongoose.Schema.ObjectId, ref: "Product", default: null },
    ram: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one RAM stick is required"
      }
    },
    storage: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one storage drive is required"
      }
    },
  },
  { _id: false }
);

const configurationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    clonedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Configuration",
      default: null
    },
    parts: partsSchema
  },
  { timestamps: true }
);

export default mongoose.model("Configuration", configurationSchema);