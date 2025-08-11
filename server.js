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
  origin: function(origin, callback) {
    // Postman ya curl jaise requests jinka origin nahi hota allow karen
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      // Agar origin list mein nahi hai to error bhej dein
      const msg = `CORS error: The origin ${origin} is not allowed.`;
      return callback(new Error(msg), false);
    }

    // Origin allowed hai, aage badho
    return callback(null, true);
  },
  credentials: true,  // cookies, auth headers allow karne ke liye
}));

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
