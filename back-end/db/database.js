import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "zodiac.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      zodiac_sign TEXT NOT NULL,
      age INTEGER,
      bio TEXT DEFAULT '',
      hobbies TEXT DEFAULT '[]',
      favorite_flower TEXT DEFAULT '',
      avatar_url TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS post_likes (
      post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (post_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS follows (
      follower_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      following_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (follower_id, following_id)
    );

    CREATE TABLE IF NOT EXISTS friendships (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      friend_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, friend_id)
    );
  `);

  seedIfEmpty();
}

function seedIfEmpty() {
  const count = db.prepare("SELECT COUNT(*) as c FROM users").get();
  if (count.c > 0) return;

  const seedUsers = [
    { email: "luna@cosmos.test", name: "Luna Star", sign: "Pisces", age: 27, bio: "Dreamer, flower enthusiast, and cosmic connector.", hobbies: ["Stargazing", "Journaling", "Gardening"], flower: "Water Lily" },
    { email: "marcus@cosmos.test", name: "Marcus Fire", sign: "Leo", age: 32, bio: "Creative director by day, astrology nerd by night.", hobbies: ["Photography", "Cooking", "Yoga"], flower: "Sunflower" },
    { email: "sage@cosmos.test", name: "Sage Moon", sign: "Virgo", age: 24, bio: "Organizing my life one zodiac chart at a time.", hobbies: ["Reading", "Hiking", "Meditation"], flower: "Daisy" },
    { email: "river@cosmos.test", name: "River Sky", sign: "Aquarius", age: 29, bio: "Tech innovator with a spiritual side.", hobbies: ["Coding", "Astrology", "Travel"], flower: "Orchid" },
    { email: "ember@cosmos.test", name: "Ember Rose", sign: "Aries", age: 26, bio: "Bold, passionate, and always chasing adventure.", hobbies: ["Running", "Dancing", "Art"], flower: "Honeysuckle" },
  ];

  const hash = bcrypt.hashSync("cosmos123", 10);
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, display_name, zodiac_sign, age, bio, hobbies, favorite_flower, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const userIds = [];
  for (const u of seedUsers) {
    const id = crypto.randomUUID();
    userIds.push(id);
    insertUser.run(id, u.email, hash, u.name, u.sign, u.age, u.bio, JSON.stringify(u.hobbies), u.flower, new Date().toISOString());
  }

  const seedPosts = [
    { userIdx: 0, content: "Just discovered my moon sign and it explains SO much about my emotional world. Anyone else feel like their chart is reading their diary? 🌙✨" },
    { userIdx: 1, content: "Leo season is HERE and I'm feeling the creative energy flow! What's everyone manifesting this month? 🔥" },
    { userIdx: 2, content: "Pro tip for fellow earth signs: keep a gratitude journal aligned with your ruling planet. 🌿" },
    { userIdx: 3, content: "Built a compatibility calculator for fun — the stars might be onto something. Who wants to test theirs?" },
  ];

  const insertPost = db.prepare("INSERT INTO posts (id, user_id, content, created_at) VALUES (?, ?, ?, ?)");
  for (const p of seedPosts) {
    insertPost.run(crypto.randomUUID(), userIds[p.userIdx], p.content, new Date().toISOString());
  }

  console.log("Database seeded with demo users and posts.");
}

export function formatUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    zodiacSign: row.zodiac_sign,
    age: row.age,
    bio: row.bio,
    hobbies: JSON.parse(row.hobbies || "[]"),
    favoriteFlower: row.favorite_flower,
    avatar: row.avatar_url || null,
    joinedAt: row.created_at,
  };
}

export default db;
