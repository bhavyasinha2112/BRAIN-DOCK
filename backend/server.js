// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const nodemailer = require("nodemailer");

const User = require("./models/User");
const News = require("./models/News");

// ✅ Load .env in local dev
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ✅ CORS (allow frontend URL or * for testing)
const CLIENT_URL = process.env.CLIENT_URL || "*";
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

/* =====================
   DATABASE CONNECTION
   ===================== */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* =====================
   AUTH ROUTES
   ===================== */
app.post("/MindCare/login", async (req, res) => {
  const { name, username, password } = req.body;
  try {
    // Signup
    if (name) {
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ msg: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 8);
      const newUser = new User({ name, username, password: hashedPassword });
      await newUser.save();

      return res.json({ msg: "User created successfully" });
    }

    // Login
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || "fallbacksecret",
      { expiresIn: "1h" }
    );
    res.json({ msg: "Login successful", token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =====================
   NEWS ROUTES
   ===================== */
app.get("/api/news", async (req, res) => {
  try {
    const { tags } = req.query;
    const filter = tags ? { tags: { $in: tags.split(",") } } : {};
    const items = await News.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/news", async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/news/:id/like", async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================
   POST ROUTES (Discussion Forum)
   ===================== */
const postsRouter = require("./routes/posts");
app.use("/api/posts", postsRouter);

/* =====================
   FEEDBACK ROUTE
   ===================== */
app.post("/api/feedback", async (req, res) => {
  const { feedback } = req.body;

  if (!feedback) {
    return res.status(400).json({ msg: "Feedback cannot be empty" });
  }

  try {
    // Transporter setup for Gmail
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,      // from env
        pass: process.env.MAIL_PASS,      // from env (App Password)
      },
    });

    let mailOptions = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: "📩 New Feedback Received",
      text: feedback,
    };

    await transporter.sendMail(mailOptions);

    res.json({ msg: "Feedback sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    res.status(500).json({ msg: "Failed to send feedback", error: error.message });
  }
});

/* =====================
   SERVER START
   ===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
