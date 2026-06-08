import express from "express";
import Contact from "../model/contact.model.js";
import resend from "../config/mail.js"; // 🚀 FIX: Apne central mail config (Brevo Wrapper) ko import kiya

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1. Database mein save karo
    const contact = await Contact.create({
      name,
      email,
      message,
    });

    // 2. User ko confirmation mail bhejo (Chupke se Brevo API chalegi)
    await resend.emails.send({
      from: "Cattle Classifier <onboarding@resend.dev>",
      to: email,
      subject: "Complaint Received - Cattle Classifier",
      html: `
        <h2>Hello ${name}</h2>
        <p>We have received your complaint/query.</p>
        <p>Our team will respond shortly.</p>
        <b>Your Message:</b>
        <p>${message}</p>
      `,
    });

    // 3. Admin ko notification bhejo
    await resend.emails.send({
      from: "Cattle Classifier System <onboarding@resend.dev>",
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      html: `
        <h3>New Complaint Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
    });
  } catch (error) {
    console.log("Contact Router Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;