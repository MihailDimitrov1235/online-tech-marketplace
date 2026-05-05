import mongoose from "mongoose";

export default new mongoose.Schema(
  {
    memory: {
      capacity: Number, // GB
      type: { type: String }, // GDDR6, GDDR6X etc.
      bandwidth: Number, // GB/s
      bus: Number, // bit
    },
    clock: {
      base: Number, // MHz
      boost: Number, // MHz
    },
    connector: String, // PCIe 3.0/4.0/5.0
    power: {
      tdp: Number, // W
      connectors: String, // 8-pin, 16-pin etc.
      recommended: Number, // W PSU recommendation
    },
    display: {
      outputs: [String],
      maxResolution: String,
      maxDisplays: Number,
    },
    dimensions: {
      length: Number, // mm
      slots: Number, // PCIe slot width
    },
    cudaCores: Number,
    shaderProcessors: Number,
  },
  { _id: false },
);
