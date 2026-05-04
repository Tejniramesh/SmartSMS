const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['delivered', 'failed', 'pending'], default: 'delivered' },
  type: { type: String, enum: ['single', 'bulk'], default: 'single' },
  segments: { type: Number, default: 1 },
  cost: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
