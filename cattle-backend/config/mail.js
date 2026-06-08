import dotenv from "dotenv";
import * as sibSdk from "@getbrevo/brevo"; // 🚀 Brevo SDK import kiya

dotenv.config();

// Brevo API Client Initialize kiya
const defaultClient = sibSdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; // Render se API key uthayega

const apiInstance = new sibSdk.TransactionalEmailsApi();

// Custom wrapper taaki purana controller system break na ho
const resendWannabe = {
  emails: {
    send: async ({ from, to, subject, html }) => {
      const sendSmtpEmail = new sibSdk.SendSmtpEmail();

      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = html;
      
      // 🚀 SENDER CONFIG: Bina domain ke aap apna real gmail use kar sakte ho!
      sendSmtpEmail.sender = { 
        name: "Cattle Classifier", 
        email: process.env.EMAIL_USER || "cattlebreedhelp@gmail.com" 
      };
      
      // RECEIVER CONFIG
      sendSmtpEmail.to = [{ email: to }];

      // Brevo ki Transactional Email API hit karein (HTTPS API Call - Render block nahi karega)
      return await apiInstance.sendTransacEmail(sendSmtpEmail);
    }
  }
};

export default resendWannabe;