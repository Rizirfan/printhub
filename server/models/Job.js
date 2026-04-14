const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  item: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  quality: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  rev: {
    type: String, // e.g. "$19.25"
    required: true
  },
  time: {
    type: String, // e.g. "4h 15m"
    required: true
  },
  idTag: {
    type: String, // e.g. "#ORD-1234"
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
