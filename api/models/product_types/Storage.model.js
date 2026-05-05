import mongoose from "mongoose";

export default new mongoose.Schema(
  {
    type: { type: String }, // HDD, SSD, NVMe
    formFactor: String, // 2.5", 3.5", M.2
    interface: String, // SATA, PCIe 3.0/4.0/5.0
    capacity: Number, // GB
    speed: {
      read: Number, // MB/s
      write: Number, // MB/s
    },
    cache: Number, // MB
    tbw: Number, // Terabytes Written endurance rating
  },
  { _id: false },
);
