import { Router } from "express";
import crypto from "crypto";
import db, { formatUser } from "../db/database.js";
import { authRequired, optionalAuth } from "../middleware/auth.js";

const router = Router();

function formatPost(row, likes, comments) {
  return {
    id: row.id,
    userId: row.user_id,
    content: row.content,
    createdAt: row.created_at,
    likes: likes.map((l) => l.user_id),
    comments: comments.map((c) => ({
      id: c.id,
      userId: c.user_id,
      content: c.content,
      createdAt: c.created_at,
    })),
  };
}

function getPostById(postId) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(postId);
  if (!post) return null;
  const likes = db.prepare("SELECT user_id FROM post_likes WHERE post_id = ?").all(postId);
  const comments = db.prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC").all(postId);
  return formatPost(post, likes, comments);
}

router.get("/", (_req, res) => {
  const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
  const result = posts.map((p) => {
    const likes = db.prepare("SELECT user_id FROM post_likes WHERE post_id = ?").all(p.id);
    const comments = db.prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC").all(p.id);
    return formatPost(p, likes, comments);
  });
  res.json(result);
});

router.post("/", authRequired, (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) {
    return res.status(400).json({ error: "Post content is required." });
  }
  if (content.length > 500) {
    return res.status(400).json({ error: "Post must be 500 characters or fewer." });
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  db.prepare("INSERT INTO posts (id, user_id, content, created_at) VALUES (?, ?, ?, ?)")
    .run(id, req.userId, content.trim(), now);

  res.status(201).json(getPostById(id));
});

router.post("/:id/like", authRequired, (req, res) => {
  const postId = req.params.id;
  const post = db.prepare("SELECT id FROM posts WHERE id = ?").get(postId);
  if (!post) return res.status(404).json({ error: "Post not found." });

  const existing = db.prepare("SELECT user_id FROM post_likes WHERE post_id = ? AND user_id = ?")
    .get(postId, req.userId);

  if (existing) {
    db.prepare("DELETE FROM post_likes WHERE post_id = ? AND user_id = ?").run(postId, req.userId);
  } else {
    db.prepare("INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)").run(postId, req.userId);
  }

  res.json(getPostById(postId));
});

router.post("/:id/comments", authRequired, (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({ error: "Comment content is required." });
  }

  const post = db.prepare("SELECT id FROM posts WHERE id = ?").get(postId);
  if (!post) return res.status(404).json({ error: "Post not found." });

  const id = crypto.randomUUID();
  db.prepare("INSERT INTO comments (id, post_id, user_id, content, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(id, postId, req.userId, content.trim(), new Date().toISOString());

  res.status(201).json(getPostById(postId));
});

export default router;
