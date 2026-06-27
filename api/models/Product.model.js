import mongoose from "mongoose";
import {
  CaseModel, CoolingModel, GpuModel, MotherboardModel, ProcessorModel,
  PsuModel, RamModel, SmartphoneModel, StorageModel
} from './product_types/index.js';

const specsSchemas = {
  case: CaseModel,
  cooling: CoolingModel,
  gpu: GpuModel,
  motherboard: MotherboardModel,
  processor: ProcessorModel,
  psu: PsuModel,
  ram: RamModel,
  smartphone: SmartphoneModel,
  storage: StorageModel
};

const PRODUCT_TYPES = Object.keys(specsSchemas);
const CONDITIONS = ["new", "refurbished", "used"];

const productSchema = new mongoose.Schema(
  {
    type: { type: String, enum: PRODUCT_TYPES, required: false },

    name: { type: String, required: true, trim: true },

    price: { type: Number, required: false },
    stock: { type: Number, required: false },
    condition: { type: String, enum: CONDITIONS, required: false },

    images: [{ type: String }],

    specs: {
      type: mongoose.Schema.Types.Mixed, // shape depends on type
      required: false,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("validate", async function () {
  const expectedSchema = specsSchemas[this.type];
  if (!expectedSchema) return;

  const specKeys = Object.keys(expectedSchema.obj);
  const missingKeys = specKeys.filter(
    (key) => expectedSchema.obj[key].required && this.specs?.[key] == null,
  );

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required specs for ${this.type}: ${missingKeys.join(", ")}`,
    );
  }
});

export default mongoose.model("Product", productSchema);
