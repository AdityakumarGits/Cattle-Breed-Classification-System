import dotenv from "dotenv";
import * as sibSdk from "@getbrevo/brevo";

dotenv.config();

// 🚀 FIX: Naye Brevo version mein direct client class instantiate hoti hai, bina instance properties ke
const apiInstance = new sibSdk.TransactionalEmailsApi();

// Render par set ki hui API KEY ko authorize kar rahe hain
apiInstance.setApiKey(sibSdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// Custom adapter wrapper taaki baki controllers ka code bilkul na badalna pade
const resendWannabe = {
  emails: {
    send: async ({ from, to, subject, html }) => {
      const sendSmtpEmail = new sibSdk.SendSmtpEmail();

      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = html;
      
      // Sender dynamic set kiya (bina domain ke aapka gmail chalega)
      sendSmtpEmail.sender = { 
        name: "Cattle Classifier", 
        email: process.env.EMAIL_USER || "cattlebreedhelp@gmail.com" 
      };
      
      // Receiver set kiya
      sendSmtpEmail.to = [{ email: to }];

      // Brevo API call execute kari (HTTPS Call - Render par block nahi hoga)
      return await apiInstance.sendTransacEmail(sendSmtpEmail);
    }
  }
};

export default resendWannabe;