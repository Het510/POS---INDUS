const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: String,
  price: Number,
  calories: Number
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  basePrice: { type: Number, required: true },
  image: { type: String, default: '' },
  imageEmoji: { type: String, default: '🍔' },
  isVeg: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  calories: Number,
  allergens: [String],
  customizations: [{
    name: String,
    options: [{
      label: String,
      extraPrice: { type: Number, default: 0 }
    }]
  }],
  variants: [variantSchema],
  tags: [String],
  rating: { type: Number, default: 4.2 },
  totalOrders: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
