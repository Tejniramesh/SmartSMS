const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const Contact = require('../models/Contact');
const User = require('../models/User');

// In-memory data references (from other routes)
router.get('/stats', auth, async (req, res) => {
  try {
    try {
      const [totalSent, delivered, failed, contacts, user] = await Promise.all([
        Message.countDocuments({ userId: req.userId }),
        Message.countDocuments({ userId: req.userId, status: 'delivered' }),
        Message.countDocuments({ userId: req.userId, status: 'failed' }),
        Contact.countDocuments({ userId: req.userId }),
        User.findById(req.userId)
      ]);

      res.json({
        totalSent,
        delivered,
        failed,
        contacts,
        credits: user?.credits || 0
      });
    } catch (dbErr) {
      // Return demo stats when no DB
      res.json({
        totalSent: 0,
        delivered: 0,
        failed: 0,
        contacts: 0,
        credits: 500
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
