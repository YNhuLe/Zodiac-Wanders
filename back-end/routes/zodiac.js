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

 router.get("/:id", (req, res) => {
   try {
     const zodiacList = fs.readFileSync("./data/zodiac.json");
     const zodiacs = JSON.parse(zodiacList);
     const id = req.params.id;
     const individualZodiac = zodiacs.find((zodiac) => zodiac.id === id);
     if (!individualZodiac) {
       return res.status(404).send("Photo not found");
     }
     res.json(individualZodiac);
   } catch (error) {
     console.error("Error reading photo.json.", error);
     res.status(500).json({ message: "Server error!" });
   }
 });

 export default router;