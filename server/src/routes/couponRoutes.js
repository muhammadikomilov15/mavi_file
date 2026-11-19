const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

router.post('/validate', validateCoupon);
router.get('/', protect, authorize('admin'), getAllCoupons);
router.post('/', protect, authorize('admin'), createCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

module.exports = router;
