import dotenv from "dotenv";
// 🚀 FIX: Ab classes ko direct destructured format mein import karenge, sibSdk ki zaroorat nahi hai
import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

dotenv.config();

// 🚀 Naye constructor ka direct object instantiate kiya
const apiInstance = new TransactionalEmailsApi();

// Render variables se uthayi hui API key ko as a string direct set kiya
apiInstance.setApiKey(0, process.env.BREVO_API_KEY); // 0 means API KEY indexing standard format

// Custom resend wrapper code taaki aapke signup/contact files ko touch na karna pade
const resendWannabe = {
  emails: {
    send: async ({ from, to, subject, html }) => {
      const sendSmtpEmail = new SendSmtpEmail();

      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = html;
      
      // Dynamic Sender configuration (Bina custom domain ke chalega)
      sendSmtpEmail.sender = { 
        name: "Cattle Classifier", 
        email: process.env.EMAIL_USER || "cattlebreedhelp@gmail.com" 
      };
      
      // Recipient mapping array
      sendSmtpEmail.to = [{ email: to }];

      // Pure HTTPS API Call (Render isko block nahi kar payega!)
      return await apiInstance.sendTransacEmail(sendSmtpEmail);
    }
  }
};

export default resendWannabe;