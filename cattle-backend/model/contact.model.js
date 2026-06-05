import mongoose from "mongoose" ;

const contactSchema =new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message:{type:String,required:true},
     status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
    createdAt: { type: Date, default: Date.now }
})

const Contact= mongoose.model("Contact",contactSchema);
export default Contact;
