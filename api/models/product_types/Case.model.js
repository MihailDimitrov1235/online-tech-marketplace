import mongoose from "mongoose";

export default new mongoose.Schema(
  {
    formFactor: String, // Full Tower, Mid Tower, Mini Tower, Small Form Factor

    supportedFormFactors: [String], // motherboard sizes this case fits, e.g. ATX, Micro-ATX, Mini-ITX, E-ATX

    maxGpuLength: Number, // mm
    maxCoolerHeight: Number, // mm
    maxPsuLength: Number, // mm

    driveBays: {
      bay35: Number, // number of 3.5" bays
      bay25: Number, // number of 2.5" bays
    },

    expansionSlots: Number, // number of PCIe expansion slots

    radiatorSupport: {
      front: String, // e.g. 360mm, 280mm, none
      top: String,
      rear: String,
    },

    frontPorts: [String], // USB-C, USB-A, Audio, etc.

    includedFans: Number, // number of fans included by default

    dimensions: {
      height: Number, // mm
      width: Number, // mm
      depth: Number, // mm
    },

    sidePanel: String, // Tempered Glass, Mesh, Solid
  },
  { _id: false },
);
