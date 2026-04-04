const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Order, Table, Offer } = require('../models/index');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper: check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id) => {
  if (!id) return false;
  try {
    return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
  } catch { return false; }
};

// Sanitize order items: strip invalid product refs (e.g. mock IDs like "p1", "p2")
const sanitizeItems = (items) =>
  items.map(item => {
    const sanitized = {
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    };
    if (item.variant) sanitized.variant = item.variant;
    if (item.customizations) sanitized.customizations = item.customizations;
    if (item.product && isValidObjectId(String(item.product))) {
      sanitized.product = item.product;
    }
    return sanitized;
  });

// Create order
router.post('/', protect, async (req, res) => {
  try {
    const {
      items, orderType, tableId, tableNumber,
      offerCode, customerName, customerPhone,
      deliveryAddress, notes
    } = req.body;

    const cleanItems = sanitizeItems(items);

    let subtotal = cleanItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    let offerId = null;

    if (offerCode) {
      const offer = await Offer.findOne({ code: offerCode.toUpperCase(), isActive: true });
      if (offer && offer.endDate > new Date() && subtotal >= offer.minOrderValue) {
        if (offer.type === 'percentage') {
          discount = Math.min((subtotal * offer.value) / 100, offer.maxDiscount || Infinity);
        } else if (offer.type === 'flat') {
          discount = offer.value;
        }
        offerId = offer._id;
        offer.usedCount += 1;
        await offer.save();
      }
    }

    const tax = Math.round(subtotal * 0.05);
    const deliveryFee = orderType === 'delivery' ? 49 : 0;
    const total = Math.round(subtotal + tax + deliveryFee - discount);
    const crownEarned = Math.floor(total / 10);

    const orderData = {
      items: cleanItems,
      orderType,
      subtotal,
      tax,
      discount,
      deliveryFee,
      total,
      crownPointsEarned: crownEarned,
      customerName,
      customerPhone,
      deliveryAddress,
      notes,
      offer: offerId,
      offerCode,
    };

    if (tableId && isValidObjectId(String(tableId))) orderData.table = tableId;
    if (tableNumber) orderData.tableNumber = tableNumber;
    if (req.user) orderData.user = req.user._id;

    const order = await Order.create(orderData);

    if (tableId && isValidObjectId(String(tableId))) {
      await Table.findByIdAndUpdate(tableId, { status: 'occupied', currentOrder: order._id });
    }

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { crownPoints: crownEarned },
        $push: { orderHistory: order._id },
      });
    }

    if (req.io) {
      req.io.to('kitchen').emit('new-order', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        tableNumber: order.tableNumber,
        items: order.items,
        orderType: order.orderType,
      });
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Order creation error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get all orders (admin/staff)
router.get('/', protect, async (req, res) => {
  try {
    const { status, date, orderType } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;
    if (date) {
      const d = new Date(date);
      filter.createdAt = { $gte: d, $lt: new Date(d.getTime() + 86400000) };
    }
    const orders = await Order.find(filter)
      .populate('table', 'tableNumber floor')
      .sort('-createdAt')
      .limit(100);
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get my orders (customer)
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(50);
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('table user');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update order status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (req.io) {
      req.io.to('kitchen').emit('order-status-changed', { orderId: order._id, status });
      if (order.table) {
        req.io.to(`customer-${order.table}`).emit('order-status-changed', {
          orderNumber: order.orderNumber, status,
        });
      }
    }
    if (status === 'completed' && order.table) {
      await Table.findByIdAndUpdate(order.table, { status: 'available', currentOrder: null });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update payment
router.put('/:id/payment', async (req, res) => {
  try {
    const { paymentMethod, paymentId, paymentStatus } = req.body;
    
    // For COD (cash), we confirm the order immediately even if status is pending
    const status = (paymentStatus === 'paid' || paymentMethod === 'cash') ? 'confirmed' : 'pending';
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentMethod, paymentId, paymentStatus, status },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Send to kitchen
router.put('/:id/send-kitchen', protect, async (req, res) => {
  try {
    // Note: Re-added 'protect' middleware to ensure orders are linked to accounts
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { sentToKitchen: true, kitchenSentAt: new Date(), status: 'confirmed', 'items.$[].kitchenStatus': 'to-cook' },
      { new: true }
    );
    if (req.io) {
      req.io.to('kitchen').emit('new-order', {
        orderId: order._id, orderNumber: order.orderNumber,
        tableNumber: order.tableNumber, items: order.items,
        orderType: order.orderType, createdAt: order.createdAt,
      });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Cancel order
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    // Check if user is owner or admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    // Restriction: Only COD (cash) orders can be cancelled through the app
    if (order.paymentMethod !== 'cash') {
      return res.status(400).json({ 
        success: false, 
        message: 'Online payments (UPI/Card/NetBanking) cannot be cancelled through the app. Please contact support for refunds.' 
      });
    }
    
    // Only allow cancellation if order is pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    // Free up table if dine-in
    if (order.table) {
      await Table.findByIdAndUpdate(order.table, { status: 'available', currentOrder: null });
    }
    
    if (req.io) {
      req.io.to('kitchen').emit('order-cancelled', { orderId: order._id });
    }
    
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
