const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const StoreSettings = require('../models/StoreSettings');
const { testTelegramConnection } = require('../services/telegramService');

// @desc Get comprehensive admin dashboard analytics
// @route GET /api/admin/dashboard
const getDashboardOverview = async (req, res, next) => {
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

    // Monthly revenue data for chart (last 6 months)
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
    next(error);
  }
};

// @desc Get all orders with filtering and search
// @route GET /api/admin/orders
const getAllOrders = async (req, res, next) => {
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
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNum),
      currentPage: pageNum,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get customers with order count and spend
// @route GET /api/admin/customers
const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    const customersWithStats = await Promise.all(
      customers.map(async (cust) => {
        const orderStats = await Order.aggregate([
          { $match: { user: cust._id, status: { $ne: 'Cancelled' } } },
          { $group: { _id: null, totalSpent: { $sum: '$total' }, orderCount: { $sum: 1 } } }
        ]);

        return {
          ...cust.toObject(),
          totalSpent: orderStats.length > 0 ? orderStats[0].totalSpent : 0,
          ordersCount: orderStats.length > 0 ? orderStats[0].orderCount : 0
        };
      })
    );

    res.status(200).json({
      success: true,
      customers: customersWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get store settings
// @route GET /api/admin/settings
const getSettings = async (req, res, next) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({
        telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
        telegramChatId: process.env.TELEGRAM_CHAT_ID || '1004335804992',
        telegramEnabled: true
      });
    }

    // Mask bot token for security in response
    const maskedSettings = settings.toObject();
    if (maskedSettings.telegramBotToken) {
      const len = maskedSettings.telegramBotToken.length;
      maskedSettings.telegramBotTokenMasked = len > 8
        ? `${maskedSettings.telegramBotToken.slice(0, 4)}...${maskedSettings.telegramBotToken.slice(-4)}`
        : '****';
      delete maskedSettings.telegramBotToken; // Never expose full token in JSON response
    }

    res.status(200).json({
      success: true,
      settings: maskedSettings
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update store settings
// @route PUT /api/admin/settings
const updateSettings = async (req, res, next) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = new StoreSettings();
    }

    const {
      storeName,
      contactPhone,
      contactEmail,
      contactAddress,
      telegramChannel,
      instagramUrl,
      deliveryFee,
      freeDeliveryThreshold,
      announcementText,
      telegramBotToken,
      telegramChatId,
      telegramEnabled
    } = req.body;

    if (storeName) settings.storeName = storeName;
    if (contactPhone) settings.contactPhone = contactPhone;
    if (contactEmail) settings.contactEmail = contactEmail;
    if (contactAddress) settings.contactAddress = contactAddress;
    if (telegramChannel) settings.telegramChannel = telegramChannel;
    if (instagramUrl) settings.instagramUrl = instagramUrl;
    if (deliveryFee !== undefined) settings.deliveryFee = deliveryFee;
    if (freeDeliveryThreshold !== undefined) settings.freeDeliveryThreshold = freeDeliveryThreshold;
    if (announcementText) settings.announcementText = announcementText;
    if (telegramChatId) settings.telegramChatId = telegramChatId;
    if (telegramEnabled !== undefined) settings.telegramEnabled = telegramEnabled;

    // Only update token if a new non-empty token was provided
    if (telegramBotToken && telegramBotToken.trim() !== '' && !telegramBotToken.includes('...')) {
      settings.telegramBotToken = telegramBotToken.trim();
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Store settings updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc Test Telegram bot credentials
// @route POST /api/admin/test-telegram
const testTelegram = async (req, res, next) => {
  try {
    const { token, chatId } = req.body;
    let botToken = token;
    let targetChatId = chatId;

    if (!botToken) {
      const settings = await StoreSettings.findOne();
      botToken = settings?.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
    }

    if (!targetChatId) {
      const settings = await StoreSettings.findOne();
      targetChatId = settings?.telegramChatId || process.env.TELEGRAM_CHAT_ID;
    }

    const result = await testTelegramConnection(botToken, targetChatId);

    res.status(200).json({
      success: true,
      message: 'Telegram test message sent successfully!',
      result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.response?.data?.description || error.message
    });
  }
};

module.exports = {
  getDashboardOverview,
  getAllOrders,
  getAllCustomers,
  getSettings,
  updateSettings,
  testTelegram
};
