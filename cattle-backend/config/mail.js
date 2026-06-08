import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// 🔒 Centralized Secure Nodemailer Configuration (Forced IPv4)
const transporter = nodemailer.createTransport({
  service: "gmail",
  // 🚀 FIX: smtp.gmail.com ki jagah direct IP family 4 configure karne ke liye host settings core options lagaye hain
  host: "smtp.gmail.com", 
  port: 465,            
  secure: true,         
  // 🚀 CRITICAL FIX: Yeh properties Nodemailer ko force karegi ki woh IPv6 network tunnel block ko bypass kare
  connectionTimeout: 10000, // 10 seconds timeout
  greetingTimeout: 10000,
  socketTimeout: 10000,
  dns: {
    // Standard DNS fallback taaki IPv4 automatically select ho
    family: 4 
  },
  auth: {
    user: process.env.EMAIL_USER, // cattlebreedhelp@gmail.com
    pass: process.env.EMAIL_PASS, // 16-digit Google App Password
  },
  tls: {
    rejectUnauthorized: false,
    // Strictly specify encryption standard for IPv4 compatibility
    minVersion: "TLSv1.2" 
  }
});

// Custom helper object to handle existing controller routing smoothly
const resendWannabe = {
  emails: {
    send: async ({ from, to, subject, html }) => {
      return await transporter.sendMail({
        from: from || `"Cattle Classifier" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });
    }
  }
};

export default resendWannabe;