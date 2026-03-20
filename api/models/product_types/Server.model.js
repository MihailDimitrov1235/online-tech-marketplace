import mongoose from "mongoose";

export default new mongoose.Schema(
  {
    formFactor: String, // "2U", "Tower", etc.
    cpu: {
      model: String,
      sockets: Number,
      coresPerSocket: Number,
    },
    memory: {
      installed: Number, // GB
      max: Number, // GB
      type: String, // "DDR5 ECC"
    },
    storage: [
      {
        type: String, // "NVMe SSD", "HDD"
        capacity: Number, // TB
        qty: Number,
      },
    ],
    networking: [
      {
        speed: Number, // GbE
        ports: Number,
      },
    ],
    powerSupply: {
      wattage: Number,
      redundant: Boolean,
    },
    rackUnits: Number,
  },
  { _id: false },
);
