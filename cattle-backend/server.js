import dotenv from "dotenv";
import express from "express";
import cors from "cors"
import predictRoutes from "./routes/predict.js";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contact.js";
import userRoutes from "./routes/user.routes.js";
import  breedRoutes from "./routes/breed.routes.js";
import cookieParser from "cookie-parser";
const app=express();
dotenv.config();


//database
connectDB();

//middleware
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173", // Aapka local testing URL
  "https://cattle-breed-classification-system.vercel.app" // Aapka live Vercel URL
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// 🍪 COOKIE PARSER (VERY IMPORTANT)
app.use(cookieParser());


//routes 

app.use("/api/predict",predictRoutes) //prediction routes
app.use("/api/auth", userRoutes); // signUp login routes
app.use("/api/info",breedRoutes);  // breed info Routes


app.use("/api/contact", contactRoutes);//contact routes


//healthy Api



 app.get("/",(req,res)=>{
    res.send("Api IS Healthy")
 })

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
    
})

