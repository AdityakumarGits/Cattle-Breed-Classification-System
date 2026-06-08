import dotenv from "dotenv";
import nodemailer from "nodemailer"; // 🚀 Resend hata kar Nodemailer import kiya

dotenv.config();

// 🔒 Global Secure Nodemailer Transporter Configuration
// Yeh centralized transporter ban gaya, ab aap pure backend mein ise kahin bhi use kar sakte ho
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,            // 🔒 Secure SSL Port (Render cloud par timeout nahi hoga)
  secure: true,         // Port 465 ke liye hamesha true
  auth: {
    user: process.env.EMAIL_USER, // cattlebreedhelp@gmail.com
    pass: process.env.EMAIL_PASS, // Aapka 16-digit Google App Password
  },
  tls: {
    rejectUnauthorized: false // Cloud network scaling proxy errors ko bypass karne ke liye
  }
});

// Resend ke purane code ke structure se match karne ke liye hum ek custom wrapper export kar rahe hain
// Isse aapko controllers mein zyada lines change nahi karni padengi!
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

// Default export ko barkaraar rakha taaki controllers ke 'import resend from ...' break na ho
export default resendWannabe;