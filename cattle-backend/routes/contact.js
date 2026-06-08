import express from "express";
import Contact from "../model/contact.model.js";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
// Render environment variables se API Key uthayega
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1. Database mein message save karo
    const contact = await Contact.create({
      name,
      email,
      message,
    });

    // 2. User ko confirmation mail bhejo
    await resend.emails.send({
      // 🚀 MAGIC HERE: Display name "Cattle Classifier" set kiya
      from: "Cattle Classifier <onboarding@resend.dev>", 
      to: email, // User ka email id
      subject: "Complaint Received - Cattle Classifier",
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Hello ${name},</h2>
          <p>Thank you for reaching out to us. We have successfully received your complaint/query.</p>
          <p>Our team is reviewing your message and will respond to you shortly.</p>
          <br />
          <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #16a34a; border-radius: 4px;">
            <strong>Your Message:</strong>
            <p style="font-style: italic; margin-top: 5px;">"${message}"</p>
          </div>
          <br />
          <p>Best Regards,<br /><strong>Team Cattle Classifier</strong></p>
        </div>
      `,
    });

    // 3. Admin (Aapko) notification mail bhejo
    await resend.emails.send({
      from: "Cattle Classifier System <onboarding@resend.dev>",
      to: process.env.EMAIL_USER, // ⚠️ Render par aapka real gmail (cattlebreedhelp@gmail.com) hona chahiye
      subject: `🚨 New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h3>New Inquiry Details:</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b></p>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${message}</p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
    });
  } catch (error) {
    console.error("Resend API/DB Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Failed to send message.",
    });
  }
});

export default router;