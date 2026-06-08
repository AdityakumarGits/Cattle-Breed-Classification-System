import express from "express";
import Contact from "../model/contact.model.js";
import nodemailer from "nodemailer";

const router = express.Router();

// 🔒 Secure Transporter Configuration (Port 465)
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,            
  secure: true,         
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false 
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const contact = await Contact.create({ name, email, message });

    // 1. User Confirmation Mail
    await transporter.sendMail({
      from: `"Cattle Classifier" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Complaint Received - Cattle Classifier",
      html: `<h2>Hello ${name}</h2><p>We have received your query.</p><p>Message: ${message}</p>`,
    });

    // 2. Admin Notification Mail
    await transporter.sendMail({
      from: `"Cattle Classifier System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Aapki mail par notification aayegi
      subject: "New Contact Form Submission",
      html: `<h3>New Message</h3><p><b>Name:</b> ${name}</p><p><b>Message:</b> ${message}</p>`,
    });

    res.status(201).json({ success: true, message: "Complaint submitted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;