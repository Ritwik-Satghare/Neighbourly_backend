import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const brevoApiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.SENDER_EMAIL;
const senderName = process.env.SENDER_NAME;

if (!brevoApiKey) {
  throw new Error("Missing required environment variable: BREVO_API_KEY");
}

if (!senderEmail) {
  throw new Error("Missing required environment variable: SENDER_EMAIL");
}

if (!senderName) {
  throw new Error("Missing required environment variable: SENDER_NAME");
}

// Initialize the unified Brevo Client using the new SDK pattern
const brevo = new BrevoClient({ apiKey: brevoApiKey });

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  try {
    console.log("Sending transactional email via Brevo:", {
      to,
      subject,
      senderEmail,
      senderName,
    });

    // Call through the correct transactionalEmails property namespace
    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: senderEmail,
        name: senderName,
      },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html,
    });

    console.log("Brevo email sent successfully");
  } catch (error) {
    console.error("Brevo sendEmail failed:", error);
    throw error;
  }
};

export default sendEmail;