import { predictImage } from "../controller/predict.controllers.js";

import express from "express"
import multer from "multer"

const router=express.Router();
// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Route
router.post("/", upload.single("file"), predictImage);

export default router;