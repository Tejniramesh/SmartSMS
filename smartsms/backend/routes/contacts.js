const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Contact = require('../models/Contact');

// In-memory contacts fallback
const inMemoryContacts = [];
let contactIdCounter = 1;

// Get contacts
router.get('/', auth, async (req, res) => {
  try {
    try {
      const contacts = await Contact.find({ userId: req.userId }).sort({ createdAt: -1 });
      res.json(contacts);
    } catch (dbErr) {
      res.json(inMemoryContacts.filter(c => c.userId === req.userId));
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add contact
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, group } = req.body;
    try {
      const contact = new Contact({ userId: req.userId, name, phone, group });
      await contact.save();
      res.json(contact);
    } catch (dbErr) {
      const contact = {
        _id: `contact-${contactIdCounter++}`,
        userId: req.userId,
        name, phone,
        group: group || 'General',
        createdAt: new Date()
      };
      inMemoryContacts.push(contact);
      res.json(contact);
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact
router.delete('/:id', auth, async (req, res) => {
  try {
    try {
      await Contact.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    } catch (dbErr) {
      const idx = inMemoryContacts.findIndex(c => c._id === req.params.id && c.userId === req.userId);
      if (idx > -1) inMemoryContacts.splice(idx, 1);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
