import { Router } from "express";
import db, { formatUser } from "../db/database.js";
import { authRequired, optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", (_req, res) => {
  const rows = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
  res.json(rows.map(formatUser));
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "User not found." });
  const user = formatUser(row);
  const { email, ...publicProfile } = user;
  res.json(publicProfile);
});

router.put("/me", authRequired, (req, res) => {
  const { displayName, zodiacSign, age, bio, hobbies, favoriteFlower, avatar } = req.body;

  if (!displayName?.trim() || !zodiacSign) {
    return res.status(400).json({ error: "Display name and zodiac sign are required." });
  }

  db.prepare(`
    UPDATE users SET display_name = ?, zodiac_sign = ?, age = ?, bio = ?, hobbies = ?, favorite_flower = ?, avatar_url = ?
    WHERE id = ?
  `).run(
    displayName.trim(),
    zodiacSign,
    age || null,
    bio || "",
    JSON.stringify(hobbies || []),
    favoriteFlower || "",
    avatar || "",
    req.userId,
  );

  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
  res.json(formatUser(row));
});

router.post("/:id/follow", authRequired, (req, res) => {
  const targetId = req.params.id;
  if (targetId === req.userId) {
    return res.status(400).json({ error: "Cannot follow yourself." });
  }

  const exists = db.prepare("SELECT follower_id FROM follows WHERE follower_id = ? AND following_id = ?")
    .get(req.userId, targetId);

  if (exists) {
    db.prepare("DELETE FROM follows WHERE follower_id = ? AND following_id = ?").run(req.userId, targetId);
    return res.json({ following: false });
  }

  db.prepare("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)").run(req.userId, targetId);
  res.json({ following: true });
});

router.get("/me/following", authRequired, (req, res) => {
  const rows = db.prepare("SELECT following_id FROM follows WHERE follower_id = ?").all(req.userId);
  res.json(rows.map((r) => r.following_id));
});

router.post("/:id/connect", authRequired, (req, res) => {
  const friendId = req.params.id;
  if (friendId === req.userId) {
    return res.status(400).json({ error: "Cannot connect with yourself." });
  }

  const exists = db.prepare("SELECT user_id FROM friendships WHERE user_id = ? AND friend_id = ?")
    .get(req.userId, friendId);

  if (!exists) {
    db.prepare("INSERT INTO friendships (user_id, friend_id) VALUES (?, ?)").run(req.userId, friendId);
  }

  res.json({ connected: true });
});

router.get("/me/friends", authRequired, (req, res) => {
  const rows = db.prepare("SELECT friend_id FROM friendships WHERE user_id = ?").all(req.userId);
  res.json(rows.map((r) => r.friend_id));
});

export default router;
