import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import { initDatabase } from "./db/database.js";
import photosRoutes from "./routes/zodiac.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";
import uploadRoutes from "./routes/upload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT ?? 5050;

initDatabase();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/photos", photosRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);
app.use("/upload", uploadRoutes);

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
