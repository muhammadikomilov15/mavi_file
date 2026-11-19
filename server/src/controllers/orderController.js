const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const StoreSettings = require('../models/StoreSettings');
const { sendTelegramOrderNotification, sendOrderNotification } = require('../services/telegramService');

// Helper to generate unique order ID
const generateOrderId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `MAVI-${dateStr}-${randomSuffix}`;
};

// @desc Create a new order (with server-side validation and Telegram dispatch)
// @route POST /api/orders
const createOrder = async (req, res, next) => {
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
      const product = await Product.findById(item.productId || item._id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product "${item.name?.uz || item.productId}" is no longer available.`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name.uz || product.name.en}". Only ${product.stock} available.`
        });
      }

      // Determine real price (respect discountPrice if active)
      const effectivePrice = (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price)
        ? product.discountPrice
        : product.price;

      const itemSubtotal = effectivePrice * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        product: product._id,
        sku: product.sku,
        name: {
          uz: product.name.uz,
          en: product.name.en,
          ru: product.name.ru
        },
        image: product.images[0] || '',
        size: item.size || 'M',
        color: {
          name: item.color?.name || 'Standard',
          hex: item.color?.hex || '#000000'
        },
        quantity: item.quantity,
        price: effectivePrice,
        subtotal: itemSubtotal
      });

      // Decrement stock and increment sales count
      product.stock -= item.quantity;
      product.salesCount = (product.salesCount || 0) + item.quantity;
      await product.save();
    }

    // 4. Fetch store settings for delivery fee
    let deliveryFee = 25000;
    const settings = await StoreSettings.findOne();
    if (settings) {
      if (settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold) {
        deliveryFee = 0;
      } else {
        deliveryFee = settings.deliveryFee;
      }
    } else if (subtotal >= 500000) {
      deliveryFee = 0;
    }

    // 5. Coupon validation
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode && couponCode.trim() !== '') {
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

          // Increment coupon usage
          appliedCoupon.usedCount += 1;
          await appliedCoupon.save();
        }
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
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Pending',
      status: 'Pending',
      telegramNotification: {
        sent: false,
        sentAt: null,
        error: '',
        retryCount: 0
      }
    });

    // 7. Send Telegram Notification automatically (fire & handle gracefully)
    try {
      const telegramResult = await sendTelegramOrderNotification(order);
      if (telegramResult.success) {
        order.telegramNotification = {
          sent: true,
          sentAt: telegramResult.sentAt,
          error: '',
          retryCount: 1,
          lastAttemptAt: new Date()
        };
        await order.save();
      } else {
        order.telegramNotification = {
          sent: false,
          sentAt: null,
          error: telegramResult.error || 'Failed to dispatch Telegram notification',
          retryCount: 1,
          lastAttemptAt: new Date()
        };
        await order.save();
      }
    } catch (telegramErr) {
      console.error('[Order Controller] Telegram notification exception:', telegramErr);
      order.telegramNotification = {
        sent: false,
        error: telegramErr.message,
        retryCount: 1,
        lastAttemptAt: new Date()
      };
      await order.save();
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        _id: order._id,
        orderId: order.orderId,
        customer: order.customer,
        items: order.items,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        discountAmount: order.discountAmount,
        total: order.total,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get user's orders
// @route GET /api/orders/my
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single order by ID or orderId
// @route GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ orderId: id.toUpperCase() });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update order status (Admin)
// @route PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc Retry failed Telegram notification (Admin)
// @route POST /api/orders/:id/retry-telegram
const retryTelegramNotification = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const result = await sendOrderNotification(order);
    
    order.telegramNotification = {
      sent: result.success,
      sentAt: result.success ? result.sentAt : order.telegramNotification.sentAt,
      error: result.success ? '' : result.error,
      retryCount: (order.telegramNotification.retryCount || 0) + 1,
      lastAttemptAt: new Date()
    };

    await order.save();

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Telegram notification delivered successfully' : 'Telegram retry failed',
      notification: order.telegramNotification
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
  retryTelegramNotification
};
