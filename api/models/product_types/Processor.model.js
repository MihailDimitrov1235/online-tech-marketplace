import mongoose from "mongoose";

export default new mongoose.Schema(
  {
    cores: {
      performance: Number,
      efficiency: Number,
      threads: Number,
    },
    clock: {
      base: Number, // GHz
      boost: Number, // GHz
    },
    socket: String, // LGA1700, AM5, etc.
    tdp: Number, // watts
    memory: {
      type: String, // DDR4, DDR5, etc.
      maxSpeed: Number, // MHz
      maxCapacity: Number, // GB
      channels: Number,
    },
    cache: {
      l2: Number, // MB
      l3: Number, // MB
    },
    architecture: String, // x86-64, ARM, etc.
    integratedGraphics: String, // optional, e.g. "Intel UHD 770"
    pcie: {
      version: String, // 4.0, 5.0, etc.
      lanes: Number,
    },
  },
  { _id: false },
);
