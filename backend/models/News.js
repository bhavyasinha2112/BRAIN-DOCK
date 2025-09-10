const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false, // optional
  },
  tags: {
    type: [String], // array of strings like ["hackathon", "college-event"]
    default: [],
  },
  likes: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
