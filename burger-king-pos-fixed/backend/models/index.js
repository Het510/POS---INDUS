const mongoose = require('mongoose');

// Category Model
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  emoji: { type: String, default: '🍔' },
  image: String,
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});
const Category = mongoose.model('Category', categorySchema);

// Order Model
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  quantity: { type: Number, default: 1 },
  price: Number,
  variant: String,
  customizations: [String],
  kitchenStatus: {
    type: String,
    enum: ['pending', 'to-cook', 'preparing', 'completed'],
    default: 'pending'
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  tableNumber: String,
  orderType: {
    type: String,
    enum: ['dine-in', 'takeaway', 'delivery', 'self-order'],
    default: 'dine-in'
  },
  items: [orderItemSchema],
  subtotal: Number,
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'netbanking', 'online'],
    default: 'cash'
  },
  paymentId: String,
  offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
  offerCode: String,
  crownPointsEarned: { type: Number, default: 0 },
  crownPointsUsed: { type: Number, default: 0 },
  customerName: String,
  customerPhone: String,
  deliveryAddress: {
    street: String,
    city: String,
    pincode: String
  },
  notes: String,
  sentToKitchen: { type: Boolean, default: false },
  kitchenSentAt: Date,
  estimatedTime: Number,
  session: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `BK${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

// Table Model
const tableSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true, unique: true },
  floor: { type: String, default: 'Ground Floor' },
  seats: { type: Number, default: 4 },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'cleaning'],
    default: 'available'
  },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  qrToken: String,
  isActive: { type: Boolean, default: true }
});
const Table = mongoose.model('Table', tableSchema);

// Offer Model
const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  code: { type: String, unique: true, uppercase: true },
  type: {
    type: String,
    enum: ['percentage', 'flat', 'bogo', 'free-item'],
    default: 'percentage'
  },
  value: Number,
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: Number,
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  startDate: Date,
  endDate: Date,
  usageLimit: Number,
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  image: String,
  badge: String
}, { timestamps: true });
const Offer = mongoose.model('Offer', offerSchema);

module.exports = { Category, Order, Table, Offer };
