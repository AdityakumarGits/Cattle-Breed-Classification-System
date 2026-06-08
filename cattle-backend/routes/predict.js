import { predictImage } from "../controller/predict.controllers.js";
import express from "express";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Multi-part form handling for file upload
router.post("/", upload.single("file"), predictImage);

export default router;