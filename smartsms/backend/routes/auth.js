const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// In-memory fallback store
const inMemoryUsers = [
  { _id: 'demo-user-1', name: 'Demo User', email: 'demo@smartsms.io', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', credits: 500 }
];

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Try MongoDB first
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already registered' });
      
      const user = new User({ name, email, password });
      await user.save();
      
      const token = generateToken(user._id);
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, credits: user.credits } });
    } catch (dbErr) {
      // Fallback: in-memory
      const existing = inMemoryUsers.find(u => u.email === email);
      if (existing) return res.status(400).json({ message: 'Email already registered' });
      
      const bcrypt = require('bcryptjs');
      const hashed = await bcrypt.hash(password, 10);
      const newUser = { _id: `user-${Date.now()}`, name, email, password: hashed, credits: 500 };
      inMemoryUsers.push(newUser);
      
      const token = generateToken(newUser._id);
      res.json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email, credits: newUser.credits } });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const bcrypt = require('bcryptjs');
    
    // Try MongoDB first
    try {
      const user = await User.findOne({ email });
      if (!user) {
        // Fallback check
        throw new Error('use_fallback');
      }
      
      const valid = await user.comparePassword(password);
      if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
      
      const token = generateToken(user._id);
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, credits: user.credits } });
    } catch (dbErr) {
      // In-memory fallback
      const user = inMemoryUsers.find(u => u.email === email);
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
      
      const token = generateToken(user._id);
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, credits: user.credits } });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
