const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
let users = []; // temporary

router.post("/signup", (req, res) => {
  const { name, username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ msg: "User already exists" });
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ name, username, password: hashedPassword });
  res.json({ msg: "User created successfully" });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ msg: "User not found" });

  const validPass = bcrypt.compareSync(password, user.password);
  if (!validPass) return res.status(400).json({ msg: "Invalid password" });

  const token = jwt.sign({ username }, "secretkey", { expiresIn: "1h" });
  res.json({ msg: "Login successful", token });
});

module.exports = router;
