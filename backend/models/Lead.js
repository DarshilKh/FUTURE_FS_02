const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: 'Admin' },
});

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: { type: String, trim: true, default: '' },
    source: {
      type: String,
      enum: ['Contact Form', 'LinkedIn', 'Referral', 'Google Ads', 'Cold Email', 'Other'],
      default: 'Contact Form',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'lost'],
      default: 'new',
    },
    company: { type: String, trim: true, default: '' },
    notes: [NoteSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', LeadSchema);
