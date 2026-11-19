const express = require('express');
const router = express.Router();
const {
  getDashboardOverview,
  getAllOrders,
  getAllCustomers,
  getSettings,
  updateSettings,
  testTelegram
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes here require Admin authorization
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardOverview);
router.get('/orders', getAllOrders);
router.get('/customers', getAllCustomers);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.post('/test-telegram', testTelegram);

module.exports = router;
