import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
   fullName:{
    type:String,
    required:true,
     trim: true,
   },
   email:{
   type:String,
   unique:true,      
   required:true,
  lowercase: true,
  trim: true,
   },
   password:{
    type:String,
    required:false,
   },
   isVerified: {
      type: Boolean,
      default: false,
    }, 
    otp: {
      type: String,
      default: null,
    },
     otpExpiry: {
      type: Date,
      default: null,
    },
    googleId: {
  type: String,
},

      authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
   },
   { timestamps: true

    });


 const User=mongoose.model("User",userSchema);
 export default User; 