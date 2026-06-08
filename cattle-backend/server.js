import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import predictRoutes from "./routes/predict.js";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contact.js";
import userRoutes from "./routes/user.routes.js";
import breedRoutes from "./routes/breed.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

connectDB();

// 🌐 MULTI-ORIGIN CORS CONFIGURATION (100% PRODUCTION READY)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://cattle-breed-classification-system.vercel.app" // Aapka Vercel Link
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("⚠️ Blocked by CORS for Origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 🚀 FIX: Preflight request bypass karne ke liye explicit methods
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"] // 🚀 FIX: Headers explicit declare kiye
}));

app.use(express.json());
app.use(cookieParser());

// Routes 
app.use("/api/predict", predictRoutes);  
app.use("/api/auth", userRoutes);        
app.use("/api/info", breedRoutes);       
app.use("/api/contact", contactRoutes);  

app.get("/", (req, res) => {
  res.send("Api IS Healthy");
});

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});