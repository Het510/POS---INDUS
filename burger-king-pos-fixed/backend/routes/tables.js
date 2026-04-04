// tables.js - export
const express = require('express');
const router = express.Router();
const { Table } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  const tables = await Table.find({ isActive: true }).populate('currentOrder', 'orderNumber status total');
  res.json({ success: true, tables });
});
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const table = await Table.create({ ...req.body, qrToken: uuidv4() });
    res.status(201).json({ success: true, table });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});
router.put('/:id', protect, adminOnly, async (req, res) => {
  const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, table });
});
router.get('/by-token/:token', async (req, res) => {
  const table = await Table.findOne({ qrToken: req.params.token }).populate('currentOrder');
  if (!table) return res.status(404).json({ success: false, message: 'Table not found' });
  res.json({ success: true, table });
});

module.exports = router;
