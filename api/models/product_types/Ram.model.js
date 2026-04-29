import mongoose from "mongoose";

export default new mongoose.Schema(
  {
    type: { type: String }, // DDR4, DDR5
    formFactor: String, // DIMM, SO-DIMM
    capacity: Number, // GB total
    speed: Number, // MHz
    latency: {
      cl: Number,
      trcd: Number,
      trp: Number,
      tras: Number,
    },
    voltage: Number, // V
    ecc: Boolean,
    sticks: Number, // kit size e.g. 2 for 2x16GB
  },
  { _id: false },
);
