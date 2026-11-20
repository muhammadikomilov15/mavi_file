const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const StoreSettings = require('../models/StoreSettings');
const { testTelegramConnection } = require('../services/telegramService');
const { isDBConnected } = require('../config/db');
const memoryStore = require('../services/memoryStore');

// @desc Get comprehensive admin dashboard analytics
// @route GET /api/admin/dashboard
const getDashboardOverview = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.getDashboardOverview(req, res);
  }

  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const processingOrders = await Order.countDocuments({ status: 'Processing' });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    // Calculate revenue
    const revenueAggregation = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(8);

    // Monthly revenue data for chart
    const monthlyStats = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 6 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        statusCounts: {
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders
        },
        recentOrders,
        monthlyStats
      }
    });
  } catch (error) {
    console.warn('[Admin Dashboard DB Fallback]:', error.message);
    return memoryStore.getDashboardOverview(req, res);
  }
};

// @desc Get all orders with filtering and search
// @route GET /api/admin/orders
const getAllOrders = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.getOrders(req, res);
  }

  try {
    const { status, search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderId: regex },
        { 'customer.fullName': regex },
        { 'customer.phone': regex },
        { 'customer.address': regex }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: orders.length,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNum),
      currentPage: pageNum,
      orders
    });
  } catch (error) {
    return memoryStore.getOrders(req, res);
  }
};

// @desc Update order status & add tracking
// @route PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.updateOrderStatus(req, res);
  }

  try {
    const { status, paymentStatus, trackingNumber, trackingCarrier, notes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return memoryStore.updateOrderStatus(req, res);
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingCarrier) order.trackingCarrier = trackingCarrier;
    if (notes) order.notes = notes;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    return memoryStore.updateOrderStatus(req, res);
  }
};

// @desc Get store settings
// @route GET /api/admin/settings
const getSettings = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.status(200).json({ success: true, settings: memoryStore.store.settings });
    }

    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create(memoryStore.store.settings);
    }

    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(200).json({ success: true, settings: memoryStore.store.settings });
  }
};

// @desc Update store settings
// @route PUT /api/admin/settings
const updateSettings = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      memoryStore.store.settings = { ...memoryStore.store.settings, ...req.body };
      return res.status(200).json({ success: true, settings: memoryStore.store.settings });
    }

    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: 'Store settings updated successfully',
      settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc Test Telegram integration
// @route POST /api/admin/telegram/test
const testTelegram = async (req, res, next) => {
  try {
    const { botToken, chatId } = req.body;
    const result = await testTelegramConnection(botToken, chatId);

    res.status(200).json({
      success: true,
      message: 'Telegram test message sent successfully!',
      result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Failed to send Telegram test: ${error.message}`
    });
  }
};

// @desc Get all customers
// @route GET /api/admin/customers
const getAllCustomers = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const customers = memoryStore.store.users.filter(u => u.role === 'customer');
      return res.status(200).json({ success: true, count: customers.length, customers });
    }

    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers
    });
  } catch (error) {
    const customers = memoryStore.store.users.filter(u => u.role === 'customer');
    res.status(200).json({ success: true, count: customers.length, customers });
  }
};

module.exports = {
  getDashboardOverview,
  getAllOrders,
  updateOrderStatus,
  getSettings,
  updateSettings,
  testTelegram,
  getAllCustomers
};
