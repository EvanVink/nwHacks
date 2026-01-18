const express = require("express");
const { addUser, getUserByEmail, verifyPassword } = require("../db/database");

const router = express.Router();

// Register
router.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    await addUser(name, email, password);
    const user = await getUserByEmail(email);
    res
      .status(201)
      .json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("register error", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res
      .status(200)
      .json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("login error", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

module.exports = router;
