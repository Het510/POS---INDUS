const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

// Generate UPI QR code
router.post('/upi-qr', async (req, res) => {
  try {
    const { amount, orderId, upiId = 'burgerkingpos@ybl' } = req.body;
    const upiString = `upi://pay?pa=${upiId}&pn=BurgerKingPOS&am=${amount}&tn=Order${orderId}&cu=INR`;
    const qrDataUrl = await QRCode.toDataURL(upiString, { width: 256, margin: 2 });
    res.json({ success: true, qrCode: qrDataUrl, upiString });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Razorpay order creation (mock if no key)
router.post('/create-razorpay', async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
      return res.json({
        success: true,
        mock: true,
        razorpayOrderId: `mock_${Date.now()}`,
        amount: amount * 100,
        currency: 'INR',
        key: 'mock_key'
      });
    }
    const Razorpay = require('razorpay');
    const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const rzpOrder = await rzp.orders.create({ amount: amount * 100, currency: 'INR', receipt: orderId });
    res.json({ success: true, razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
