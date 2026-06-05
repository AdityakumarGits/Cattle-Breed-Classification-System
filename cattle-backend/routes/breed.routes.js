 import express from "express";
import  getBreedInfo  from "../controller/breed.controller.js";
import { isAuthenticated } from "../middleware/auth.js";



 const router=express.Router();

 router.post("/info",isAuthenticated,getBreedInfo);

 export default router;