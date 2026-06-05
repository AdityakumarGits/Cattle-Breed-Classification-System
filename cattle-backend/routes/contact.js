import express from "express";
import Contact from "../model/contact.model.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      message,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      
    });

    // User Confirmation Mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Complaint Received",
      html: `
        <h2>Hello ${name}</h2>
        <p>We have received your complaint/query.</p>
        <p>Our team will respond shortly.</p>

        <b>Message:</b>
        <p>${message}</p>
      `,
    });

    // Admin Notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      html: `
        <h3>New Complaint Received</h3>

        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>

        <p>${message}</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;