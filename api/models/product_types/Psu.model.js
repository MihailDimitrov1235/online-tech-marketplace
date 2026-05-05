import mongoose from "mongoose";

export default new mongoose.Schema(
  {
    wattage: Number, // W
    formFactor: String, // ATX, SFX etc.
    efficiency: String, // 80+ Gold etc.
    modular: String, // Full, Semi, Non
    connectors: {
      eps: Number, // CPU power
      pcie8pin: Number,
      pcie16pin: Number, // 16-pin / 12VHPWR
      sata: Number,
      molex: Number,
    },
    protection: {
      ovp: Boolean,
      uvp: Boolean,
      ocp: Boolean,
      opp: Boolean,
      scp: Boolean,
      otp: Boolean,
    },
    fanSize: Number, // mm
    length: Number, // mm
  },
  { _id: false },
);
