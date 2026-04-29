import mongoose from "mongoose";

export default new mongoose.Schema(
  {
    socket: String, // LGA1700, AM5, etc.
    chipset: String, // Z790, B650, etc.
    formFactor: String, // ATX, Micro-ATX, Mini-ITX, etc.
    memory: {
      type: { type: String }, // DDR4, DDR5
      maxSpeed: Number, // MHz
      maxCapacity: Number, // GB
      slots: Number,
    },
    pci: {
      version: String, // PCIe 3.0, 4.0, 5.0
      x16Slots: Number,
      x1Slots: Number,
    },
    storage: {
      sataPorts: Number,
      m2Slots: Number,
      raidSupport: Boolean,
    },
    power: {
      cpuPowerConnector: String, // 4-pin, 8-pin, 8+4, etc.
      phases: Number, // VRM phases
    },
    networking: {
      ethernetSpeed: String, // 1Gb, 2.5Gb, etc.
      wifi: Boolean,
      bluetooth: Boolean,
    },
    usb: {
      usb2: Number,
      usb3: Number,
      usbC: Number,
    },
    audio: {
      channels: String, // 5.1, 7.1, etc.
      chipset: String, // ALC897, ALC1220, etc.
    },
  },
  { _id: false },
);
