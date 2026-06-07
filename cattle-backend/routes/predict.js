// import { predictImage } from "../controller/predict.controllers.js";
// import fs from "fs";
// import express from "express";
// import multer from "multer";

// const router = express.Router();

// const uploadDir = "uploads";

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// router.post("/", upload.single("file"), predictImage);

// export default router;
import { predictImage } from "../controller/predict.controllers.js";
import express from "express";
import multer from "multer";

const router = express.Router();

// 👈 FIX: Purana diskStorage aur fs.mkdirSync sab hata diya hai.
// Ab hum memoryStorage use kar rahe hain taaki image disk par save na ho aur Vercel/Render crash na ho.
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route bilkul pehle jaisa hi rahega
router.post("/", upload.single("file"), predictImage);

export default router;