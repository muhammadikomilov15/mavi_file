const Review = require('../models/Review');

// @desc Get reviews for a product
// @route GET /api/reviews/:productId
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true
    }).sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
      : 5.0;

    res.status(200).json({
      success: true,
      reviews,
      totalReviews,
      averageRating: parseFloat(averageRating)
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add a review
// @route POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { productId, name, rating, comment } = req.body;
    if (!productId || !name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'All review fields are required' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user ? req.user._id : null,
      name,
      rating: Number(rating),
      comment
    });

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  createReview
};
