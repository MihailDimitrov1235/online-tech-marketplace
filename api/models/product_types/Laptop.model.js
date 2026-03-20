import mongoose from "mongoose";

export default new mongoose.Schema(
  {
    display: {
      size: Number,
      resolution: String,
      type: String,
    },
    processor: {
      model: String,
      cores: Number,
    },
    memory: {
      ram: Number, // GB
      storage: Number, // GB
    },
    gpu: {
      model: String,
      vram: Number, // GB
    },
    battery: {
      capacity: Number, // Wh
      life: Number, // hours
    },
    weight: Number, // kg
    ports: [String],
  },
  { _id: false },
);
