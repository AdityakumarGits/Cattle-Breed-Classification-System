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

// Database connection
connectDB();

// 🌐 MULTI-ORIGIN CORS CONFIGURATION (100% PRODUCTION READY)
const allowedOrigins = [
  "http://localhost:5173", // Standard Vite Port
  "http://localhost:5174", // Backup Vite Port
  process.env.FRONTEND_URL  // 🚀 Vercel/Render Frontend URL jo aap .env variable mein daloge
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);
    
    // 🚀 FIX: Ab yeh strictly allowedOrigins array ko check karega. 
    // Credentials true hone par whitelist exact match hona compulsory hai.
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("⚠️ Blocked by CORS for Origin:", origin); // Logs mein dikhega agar koi galat origin hit karega
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Cookies (JWT token) handle karne ke liye zaroori hai
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes 
app.use("/api/predict", predictRoutes);  // prediction routes
app.use("/api/auth", userRoutes);        // signUp login routes
app.use("/api/info", breedRoutes);       // breed info Routes
app.use("/api/contact", contactRoutes);  // contact routes

// Healthy API
app.get("/", (req, res) => {
  res.send("Api IS Healthy");
});

// Dynamic Port for Cloud Platforms
const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});