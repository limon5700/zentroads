const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  companyAddress: {
    type: String,
    required: true,
    trim: true,
  },
  companyPhone: {
    type: String,
    trim: true,
  },
  companyEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  gstNumber: {
    type: String,
    trim: true,
  },
  // Add other relevant company fields here
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company; 