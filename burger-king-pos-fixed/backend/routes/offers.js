const express = require('express');
const router = express.Router();
const { Offer } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const now = new Date();
  const offers = await Offer.find({ isActive: true, $or: [{ endDate: { $gte: now } }, { endDate: null }] });
  res.json({ success: true, offers });
});

router.post('/validate', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const offer = await Offer.findOne({ code: code.toUpperCase(), isActive: true });
    if (!offer) return res.status(404).json({ success: false, message: 'Invalid offer code' });
    if (offer.endDate && offer.endDate < new Date()) return res.status(400).json({ success: false, message: 'Offer expired' });
    if (orderTotal < offer.minOrderValue) return res.status(400).json({ success: false, message: `Min order ₹${offer.minOrderValue} required` });

    let discount = 0;
    if (offer.type === 'percentage') discount = Math.min((orderTotal * offer.value) / 100, offer.maxDiscount || Infinity);
    else if (offer.type === 'flat') discount = offer.value;

    res.json({ success: true, offer, discount: Math.round(discount) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, offer });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

module.exports = router;
