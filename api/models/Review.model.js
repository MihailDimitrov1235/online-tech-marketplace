import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Review", reviewSchema);
