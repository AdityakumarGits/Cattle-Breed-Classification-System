import dotenv from "dotenv";
import axios from "axios"; // 🚀 FIX: SDK hata kar direct standard Axios use kiya

dotenv.config();

// Custom resend wrapper taaki aapke signup/contact controllers ka code bilkul na badalna pade
const resendWannabe = {
  emails: {
    send: async ({ from, to, subject, html }) => {
      try {
        // 🚀 Direct Brevo Transactional Email HTTP API Endpoint call
        const response = await axios.post(
          "https://api.brevo.com/v3/smtp/email",
          {
            sender: {
              name: "Cattle Classifier",
              email: process.env.EMAIL_USER || "alpha30.8080@gmail.com", // Aapka Gmail
            },
            to: [{ email: to }], // Jise OTP ya mail bhejna hai
            subject: subject,
            htmlContent: html, // Aapka OTP ya Message ka HTML body
          },
          {
            headers: {
              "accept": "application/json",
              "api-key": process.env.BREVO_API_KEY, // Render par set ki hui API Key
              "content-type": "application/json",
            },
          }
        );

        console.log("🚀 Brevo API Success:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Brevo API Error:", error.response ? error.response.data : error.message);
        throw error;
      }
    },
  },
};

export default resendWannabe;