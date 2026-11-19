const express = require('express');
const router = express.Router();
const { getProductReviews, createReview } = require('../controllers/reviewController');

router.get('/:productId', getProductReviews);
router.post('/', createReview);

module.exports = router;
