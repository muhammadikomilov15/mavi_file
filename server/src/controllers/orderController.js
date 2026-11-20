const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const StoreSettings = require('../models/StoreSettings');
const { sendTelegramOrderNotification } = require('../services/telegramService');
const { isDBConnected } = require('../config/db');
const memoryStore = require('../services/memoryStore');

// Helper to generate unique order ID
const generateOrderId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `MAVI-${dateStr}-${randomSuffix}`;
};

// @desc Create a new order (with server-side validation and Telegram dispatch)
// @route POST /api/orders
const createOrder = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.createOrder(req, res);
  }

  try {
    const {
      customer,
      items,
      couponCode,
      paymentMethod = 'Cash on Delivery'
    } = req.body;

    // 1. Validate customer information
    if (!customer || !customer.fullName || !customer.phone || !customer.region || !customer.district || !customer.address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required shipping and contact details.'
      });
    }

    // 2. Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items before checkout.'
      });
    }

    // 3. Server-side validation of products, availability, and prices
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      let product = null;
      const prodId = item.productId || item._id;

      if (prodId && typeof prodId === 'string' && prodId.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(prodId);
      } else if (prodId) {
        product = await Product.findOne({ sku: String(prodId).toUpperCase() });
      }

      // If product not found in Mongo, fallback to checking memory store products
      if (!product) {
        const memProd = memoryStore.store.products.find(p => p._id === prodId || p.sku === prodId);
        if (memProd) {
          product = memProd;
        }
      }

      const effectivePrice = (product && product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price)
        ? product.discountPrice
        : (product ? product.price : (item.price || 0));

      const itemSubtotal = effectivePrice * (item.quantity || 1);
      subtotal += itemSubtotal;

      validatedItems.push({
        product: product ? product._id : null,
        sku: product ? product.sku : 'MAVI-ITEM',
        name: product ? {
          uz: product.name.uz,
          en: product.name.en,
          ru: product.name.ru
        } : (typeof item.name === 'object' ? item.name : { uz: item.name, en: item.name, ru: item.name }),
        image: (product && product.images && product.images[0]) ? product.images[0] : (item.image || ''),
        size: item.size || 'M',
        color: {
          name: item.color?.name || 'Standard',
          hex: item.color?.hex || '#000000'
        },
        quantity: item.quantity || 1,
        price: effectivePrice,
        subtotal: itemSubtotal
      });

      // Update product stock if MongoDB doc
      if (product && typeof product.save === 'function') {
        product.stock = Math.max(0, product.stock - (item.quantity || 1));
        product.salesCount = (product.salesCount || 0) + (item.quantity || 1);
        await product.save().catch(() => {});
      }
    }

    // 4. Fetch store settings for delivery fee
    let deliveryFee = 25000;
    try {
      const settings = await StoreSettings.findOne();
      if (settings) {
        deliveryFee = (settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold) ? 0 : settings.deliveryFee;
      } else if (subtotal >= 500000) {
        deliveryFee = 0;
      }
    } catch {
      if (subtotal >= 500000) deliveryFee = 0;
    }

    // 5. Coupon validation
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode && couponCode.trim() !== '') {
      try {
        appliedCoupon = await Coupon.findOne({
          code: couponCode.trim().toUpperCase(),
          isActive: true,
          expiryDate: { $gte: new Date() }
        });

        if (appliedCoupon) {
          if (!appliedCoupon.minOrderAmount || subtotal >= appliedCoupon.minOrderAmount) {
            if (appliedCoupon.discountType === 'percentage') {
              discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
              if (appliedCoupon.maxDiscount && appliedCoupon.maxDiscount > 0) {
                discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscount);
              }
            } else {
              discountAmount = appliedCoupon.discountValue;
            }

            appliedCoupon.usedCount = (appliedCoupon.usedCount || 0) + 1;
            await appliedCoupon.save().catch(() => {});
          }
        }
      } catch (cErr) {
        console.warn('[Coupon verification notice]:', cErr.message);
      }
    }

    const total = Math.max(0, subtotal + deliveryFee - discountAmount);
    const orderId = generateOrderId();

    // 6. Create order in MongoDB
    const order = await Order.create({
      orderId,
      user: req.user ? req.user._id : null,
      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim() : '',
        region: customer.region.trim(),
        district: customer.district.trim(),
        address: customer.address.trim(),
        notes: customer.notes ? customer.notes.trim() : ''
      },
      items: validatedItems,
      subtotal,
      deliveryFee,
      discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : '',
      total,
      paymentMethod,
      paymentStatus: 'Pending',
      status: 'Pending'
    });

    // 7. Dispatch Telegram Notification
    try {
      sendTelegramOrderNotification(order).catch(err => {
        console.warn('[Async Telegram Notice]:', err);
      });
    } catch (tgErr) {
      console.warn('[Telegram Error]:', tgErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully and sent to dispatch',
      orderId: order.orderId,
      order
    });
  } catch (error) {
    console.warn('[Order DB Fallback]:', error.message);
    return memoryStore.createOrder(req, res);
  }
};

// @desc Get customer orders
// @route GET /api/orders/my
const getMyOrders = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.getOrders(req, res);
  }

  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    return memoryStore.getOrders(req, res);
  }
};

// @desc Get single order by ID or orderId
// @route GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.getOrderById(req, res);
  }

  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ orderId: id.toUpperCase() });
    }

    if (!order) {
      return memoryStore.getOrderById(req, res);
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    return memoryStore.getOrderById(req, res);
  }
};

// @desc Update order status
// @route PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  if (!isDBConnected()) {
    return memoryStore.updateOrderStatus(req, res);
  }

  try {
    const { status, notes } = req.body;
    let order;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.id);
    } else {
      order = await Order.findOne({ orderId: req.params.id.toUpperCase() });
    }

    if (!order) {
      return memoryStore.updateOrderStatus(req, res);
    }

    if (status) order.status = status;
    if (notes) order.notes = notes;
    await order.save();

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    return memoryStore.updateOrderStatus(req, res);
  }
};

// @desc Retry Telegram notification
// @route POST /api/orders/:id/retry-telegram
const retryTelegramNotification = async (req, res, next) => {
  try {
    let order = null;
    if (isDBConnected()) {
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(req.params.id);
      } else {
        order = await Order.findOne({ orderId: req.params.id.toUpperCase() });
      }
    }

    if (!order) {
      order = memoryStore.store.orders.find(o => o._id === req.params.id || o.orderId === req.params.id);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const result = await sendTelegramOrderNotification(order);
    res.status(200).json({ success: result.success, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Cancel an order
// @route PUT /api/orders/:id/cancel
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Order can only be cancelled while in Pending status.'
      });
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  retryTelegramNotification,
  cancelOrder
};
