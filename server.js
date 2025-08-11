// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const allowedOrigins = ['https://profile-app-frontend-omega.vercel.app'];
// React build folder serve karen
app.use(express.static(path.join(__dirname, 'client/build')));

// SPA fallback: sab unknown routes ko React ke index.html pe redirect karo
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

dotenv.config();
const app = express();

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like curl, postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,  // agar aap credentials bhej rahe hain
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
