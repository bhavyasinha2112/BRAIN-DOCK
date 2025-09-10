// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Post = require('../models/Post');

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});
const upload = multer({ storage });

// GET all posts (newest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single post
router.get('/:id', async (req, res) => {
  try {
    const p = await Post.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Post not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE post
// Accepts either multipart/form-data (field 'image') or JSON body with optional image (base64 or URL)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let imageVal = null;
    if (req.file) {
      imageVal = `/uploads/${req.file.filename}`; // frontend can load from http://localhost:5000/uploads/...
    } else if (req.body.image) {
      imageVal = req.body.image;
    }

    const post = new Post({
      title: req.body.title || '',
      body: req.body.body || '',
      author: req.body.author || 'Guest',
      votes: 0,
      image: imageVal,
      comments: [],
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD comment
// body: { text: "comment", author: "Guest" }
router.post('/:id/comment', async (req, res) => {
  try {
    const { text, author } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.push({ text, author: author || 'Guest' });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VOTE
// body: { delta: 1 } or { delta: -1 }
router.post('/:id/vote', async (req, res) => {
  try {
    const delta = Number(req.body.val);
    if (![1, -1].includes(delta)) return res.status(400).json({ error: 'val must be 1 or -1' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.votes = (post.votes || 0) + delta;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
