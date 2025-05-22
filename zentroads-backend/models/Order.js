const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  packageName: {
    type: String,
    required: true,
  },
  packagePrice: {
    type: Number,
    required: true,
  },
  packageDurationValue: { // e.g., 1, 3, 6, 12
    type: Number,
    required: true,
  },
  packageDurationUnit: { // e.g., 'month', 'year'
    type: String,
    enum: ['month', 'year'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the `updatedAt` field on save
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 