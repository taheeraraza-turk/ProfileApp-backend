require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ======================
// BULLETPROOF CORS SETUP
// ======================
const allowedOrigins = [
  'https://profile-app-frontend-omega.vercel.app',
  'http://localhost:3000' // Make sure this matches your frontend dev port
];

// 1. CORS Middleware (Handles preflight and actual requests)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Immediately respond to OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ======================
// DATABASE CONNECTION
// ======================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if DB connection fails
});

// Auto-reconnect logic
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Reconnecting...');
  mongoose.connect(process.env.MONGO_URI);
});

// ======================
// ROUTES
// ======================
app.use(express.json());

// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Profile Routes
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

// ======================
// STATIC FILES (FOR PRODUCTION)
// ======================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// ======================
// ERROR HANDLING
// ======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});