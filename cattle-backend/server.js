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

// 🌐 MULTI-ORIGIN CORS CONFIGURATION (DEPLOYMENT READY)
const allowedOrigins = [
  "http://localhost:5173", // Standard Vite Port
  "http://localhost:5174", // Backup Vite Port
  process.env.FRONTEND_URL  // 👈 FIX: Jab aap React deploy karoge, toh uska URL .env se yahan automatic aa jayega
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);
    
    // Production mein agar frontend URL check karna ho, ya agar aap test kar rahe ho
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "production") {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
// 🍪 COOKIE PARSER
app.use(cookieParser());

// Routes 
app.use("/api/predict", predictRoutes); // prediction routes
app.use("/api/auth", userRoutes);       // signUp login routes
app.use("/api/info", breedRoutes);      // breed info Routes
app.use("/api/contact", contactRoutes);  // contact routes

// Healthy API
app.get("/", (req, res) => {
  res.send("Api IS Healthy");
});

// 🚀 FIX: Render/Cloud platforms apna dynamic port (process.env.PORT) inject karte hain.
// Agar woh nahi milega, tabhi server 3000 par chalega.
const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});