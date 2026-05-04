const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sms', require('./routes/sms'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('⚠️  Starting server without MongoDB (in-memory mode)...');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT} (no DB)`);
    });
  });

module.exports = app;
