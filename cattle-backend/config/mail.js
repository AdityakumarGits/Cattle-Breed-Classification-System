import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// 🔒 Forced Static IPv4 Address for Gmail SMTP
const transporter = nodemailer.createTransport({
  // ❌ service: "gmail" ko hata diya kyunki woh internal domain settings override kar deta hai
  host: "74.125.130.108", // 🚀 CRITICAL FIX: Yeh direct smtp.gmail.com ka original IPv4 Cluster address hai!
  port: 465,            
  secure: true,         
  connectionTimeout: 15000, 
  greetingTimeout: 15000,
  socketTimeout: 15000,
  auth: {
    user: process.env.EMAIL_USER, // cattlebreedhelp@gmail.com
    pass: process.env.EMAIL_PASS, // 16-digit Google App Password
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
    servername: "smtp.gmail.com" // 🚀 ZAROORI: Google certificates validity validation ke liye domain specify karna compulsory hai
  }
});

// Custom helper wrapper backend routing support ke liye
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