const express = require('express');
const router = express.Router();
const { Order } = require('../models/index');

// Get kitchen orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({
      sentToKitchen: true,
      status: { $in: ['confirmed', 'preparing', 'ready'] }
    }).sort('kitchenSentAt').limit(50);
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update item kitchen status
router.put('/orders/:orderId/items/:itemIndex', async (req, res) => {
  try {
    const { kitchenStatus } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.items[req.params.itemIndex].kitchenStatus = kitchenStatus;

    const allDone = order.items.every(i => i.kitchenStatus === 'completed');
    if (allDone) order.status = 'ready';

    await order.save();

    if (req.io) req.io.to('kitchen').emit('item-updated', { orderId: order._id, itemIndex: req.params.itemIndex, kitchenStatus });

    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
