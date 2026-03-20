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
    camera: {
      main: Number, // MP
      front: Number, // MP
    },
    battery: {
      capacity: Number, // mAh
    },
    connectivity: [String], // ["5G", "Wi-Fi 7", "NFC"]
    os: String,
  },
  { _id: false },
);
