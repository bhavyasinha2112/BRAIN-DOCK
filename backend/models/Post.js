// backend/models/Post.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: 'Guest' },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  body: { type: String, default: '' },
  author: { type: String, default: 'Guest' },
  votes: { type: Number, default: 0 },
  // image: either stored URL path like '/uploads/abc.jpg' or base64 string
  image: { type: String, default: null },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
