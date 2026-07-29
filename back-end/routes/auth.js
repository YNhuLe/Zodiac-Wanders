import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import db, { formatUser } from "../db/database.js";
import { authRequired, signToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", (req, res) => {
  const { email, password, displayName, zodiacSign, age, bio, hobbies, favoriteFlower } = req.body;

  if (!email || !password || !displayName || !zodiacSign) {
    return res.status(400).json({ error: "Email, password, display name, and zodiac sign are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const id = crypto.randomUUID();
  const hash = bcrypt.hashSync(password, 10);
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO users (id, email, password_hash, display_name, zodiac_sign, age, bio, hobbies, favorite_flower, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    email.toLowerCase(),
    hash,
    displayName.trim(),
    zodiacSign,
    age || null,
    bio || "",
    JSON.stringify(hobbies || []),
    favoriteFlower || "",
    now,
  );

  const user = formatUser(db.prepare("SELECT * FROM users WHERE id = ?").get(id));
  const token = signToken(id);
  res.status(201).json({ user, token });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const user = formatUser(row);
  const token = signToken(row.id);
  res.json({ user, token });
});

router.get("/me", authRequired, (req, res) => {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
  if (!row) return res.status(404).json({ error: "User not found." });
  res.json(formatUser(row));
});

export default router;
