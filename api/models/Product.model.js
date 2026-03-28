import mongoose from "mongoose";
import smartphoneSpecsSchema from "./product_types/Smartphone.model.js";
import laptopSpecsSchema from "./product_types/Laptop.model.js";
import serverSpecsSchema from "./product_types/Server.model.js";

const specsSchemas = {
  smartphone: smartphoneSpecsSchema,
  laptop: laptopSpecsSchema,
  server: serverSpecsSchema,
};

const PRODUCT_TYPES = ["smartphone", "laptop", "server", "other"];
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
