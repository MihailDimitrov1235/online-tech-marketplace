import ReviewModel from "../models/Review.model.js";

export async function getProductReviews(req, res) {
  try {
    const { product, page = 1, limit = 20 } = req.query;
    const filter = { product: product };
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      ReviewModel.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .populate("author", "username firstName lastName"),
      ReviewModel.countDocuments(filter),
    ]);
    res.status(200).json({
      reviews: reviews,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createProductReview(req, res) {
  try {
    const review = await ReviewModel.create({
      ...req.body,
      author: req.user._id,
    });

    res.status(201).json({ review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
export async function updateProductReview(req, res) {
  try {
    const review = await ReviewModel.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const allowed = ["comment", "rating"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        review[field] = req.body[field];
      }
    });
    await review.save();
    res.status(200).json({ review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteProductReview(req, res) {
  try {
    const review = await ReviewModel.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this review" });
    }
    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
