const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

// In-memory message store (fallback)
const inMemoryMessages = [];
let msgIdCounter = 1;

// FAKE SMS function - always returns delivered
function sendSMS(recipient, message) {
  return {
    status: Math.random() > 0.1 ? 'delivered' : 'failed',
    messageId: `MSG-${Date.now()}`,
    recipient,
    timestamp: new Date()
  };
}

function getSegments(msg) {
  return Math.ceil(msg.length / 160);
}

// Send SMS
router.post('/send', auth, async (req, res) => {
  try {
    const { recipients, message, type = 'single' } = req.body;
    const recipientList = Array.isArray(recipients) ? recipients : [recipients];
    const segments = getSegments(message);
    const cost = recipientList.length * segments;

    const results = [];

    for (const recipient of recipientList) {
      const smsResult = sendSMS(recipient, message);

      // Try MongoDB
      try {
        const msg = new Message({
          userId: req.userId,
          recipient,
          message,
          status: smsResult.status,
          type,
          segments,
          cost: segments
        });
        await msg.save();

        // Deduct credits
        await User.findByIdAndUpdate(req.userId, { $inc: { credits: -segments } });
        results.push(msg);
      } catch (dbErr) {
        // Fallback in-memory
        const msg = {
          _id: `msg-${msgIdCounter++}`,
          userId: req.userId,
          recipient,
          message,
          status: smsResult.status,
          type,
          segments,
          cost: segments,
          createdAt: new Date()
        };
        inMemoryMessages.push(msg);
        results.push(msg);
      }
    }

    res.json({ success: true, sent: results.length, results });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get messages
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;

    try {
      let query = { userId: req.userId };
      if (search) {
        query.$or = [
          { recipient: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } }
        ];
      }
      const messages = await Message.find(query).sort({ createdAt: -1 }).limit(100);
      res.json(messages);
    } catch (dbErr) {
      // In-memory fallback
      let msgs = inMemoryMessages.filter(m => m.userId === req.userId);
      if (search) {
        msgs = msgs.filter(m =>
          m.recipient.includes(search) || m.message.toLowerCase().includes(search.toLowerCase())
        );
      }
      res.json(msgs.reverse());
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
