const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'SmartSMS Backend Running Successfully 🚀'
  });
});

// Routes
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/sms', require('./routes/sms'));
  app.use('/api/contacts', require('./routes/contacts'));
  app.use('/api/dashboard', require('./routes/dashboard'));
} catch (err) {
  console.error('Route loading error:', err);
}

// PORT
const PORT = process.env.PORT || 8080;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ MongoDB connected');

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});