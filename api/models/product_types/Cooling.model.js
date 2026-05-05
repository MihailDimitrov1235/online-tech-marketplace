import mongoose from "mongoose";

export default new mongoose.Schema(
  {
    type: { type: String }, // Air, AIO Liquid, Custom Liquid
    sockets: [String], // supported CPU sockets
    tdp: Number, // W rated cooling capacity
    noise: {
      min: Number, // dBA
      max: Number, // dBA
    },
    fan: {
      size: String, // mm
      count: Number,
      minRpm: Number,
      maxRpm: Number,
      bearing: String, // Fluid, Ball, Sleeve etc.
    },
    radiator: {
      size: String, // 240mm, 360mm etc.
      thickness: Number, // mm
    },
    dimensions: {
      height: Number, // mm
      width: Number, // mm
      depth: Number, // mm
    },
    heatpipes: Number,
    argb: Boolean,
  },
  { _id: false },
);
