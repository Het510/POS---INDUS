// dashboard.js
const express = require('express');
const router = express.Router();
const { Order } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today.getTime() - 7 * 86400000);

    const [todayOrders, weekOrders, totalOrders] = await Promise.all([
      Order.find({ createdAt: { $gte: today }, paymentStatus: 'paid' }),
      Order.find({ createdAt: { $gte: weekAgo }, paymentStatus: 'paid' }),
      Order.find({ paymentStatus: 'paid' })
    ]);

    const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
    const weekRevenue = weekOrders.reduce((s, o) => s + o.total, 0);
    const totalRevenue = totalOrders.reduce((s, o) => s + o.total, 0);

    const recentOrders = await Order.find().sort('-createdAt').limit(10).populate('table', 'tableNumber');

    res.json({
      success: true,
      stats: {
        todayOrders: todayOrders.length,
        todayRevenue,
        weekOrders: weekOrders.length,
        weekRevenue,
        totalOrders: totalOrders.length,
        totalRevenue,
        recentOrders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
