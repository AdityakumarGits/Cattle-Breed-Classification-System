import mongoose from "mongoose";

const breedSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    breed:{
        type:String,
         required:true,
        },
    response:{
        type:String,
        required:true
    },
    }, {
        timestamps:true
    });
    
const Breed= mongoose.model("Breed",breedSchema);
export default Breed;