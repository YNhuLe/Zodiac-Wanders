import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import fs from "fs";
import db from "../db/database.js";
import { authRequired } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "..", "public", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, png, webp, gif) are allowed."));
    }
  },
});

const router = Router();

router.post("/avatar", authRequired, upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided." });
  }

  const avatarUrl = `/uploads/${req.file.filename}`;
  db.prepare("UPDATE users SET avatar_url = ? WHERE id = ?").run(avatarUrl, req.userId);
  res.json({ avatarUrl });
});

export default router;
