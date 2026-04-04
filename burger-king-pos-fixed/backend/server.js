const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Allow all origins (dev-friendly: works from any device on local network)
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
};

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach io to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/kitchen', require('./routes/kitchen'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BK POS API running', timestamp: new Date() });
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-kitchen', () => {
    socket.join('kitchen');
    console.log('Kitchen display connected');
  });

  socket.on('join-customer-display', (tableId) => {
    socket.join(`customer-${tableId}`);
  });

  socket.on('order-status-update', (data) => {
    io.to('kitchen').emit('order-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/burger-king-pos')
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT} (accessible on all network interfaces)`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = { app, io };
