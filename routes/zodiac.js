import express from "express";
import fs from "fs";
 const router = express.Router();

 router.get("/", (_req, res) => {
   try {
     const photo = fs.readFileSync("./data/zodiac.json");
     const photAlbum = JSON.parse(photo);
     res.json(photAlbum);
   } catch (error) {
     console.error("Error reading photo.json.", error);
     res.status(500).json({ message: "Server error!" });
   }
 });

 export default router;