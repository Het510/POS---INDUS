// categories.js
const express = require('express');
const router = express.Router();
const { Category } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('displayOrder');
  res.json({ success: true, categories });
});
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json({ success: true, category: cat });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
