import mongoose from "mongoose";

export default new mongoose.Schema(
  {
    display: {
      size: Number, // inches
      resolution: String, // e.g. "3088x1440"
      type: String, // AMOLED, IPS, etc.
    },
    processor: {
      chip: String,
      cores: Number,
    },
    memory: {
      ram: Number, // GB
      storage: Number, // GB
    },
    battery: Number, // mAh
    os: String,
  },
  { _id: false },
);
