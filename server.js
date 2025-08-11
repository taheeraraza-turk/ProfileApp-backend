const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const app = express();

const allowedOrigins = [
  'https://profile-app-frontend-omega.vercel.app',
  'http://localhost:5000'
];


app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Enable cookies/auth headers if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));
// Handle preflight requests
app.options('*', cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Serve frontend static files if needed
app.use(express.static(path.join(__dirname, '../frontend/dist'))); // Adjust as needed

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Reconnecting...');
  mongoose.connect(process.env.MONGO_URI); // Auto-reconnect
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
