import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const brevoApiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.SENDER_EMAIL;
const senderName = process.env.SENDER_NAME;

let brevo: any = null;

if (!brevoApiKey || !senderEmail || !senderName) {
  console.warn("⚠️ Missing required environment variables for Brevo (BREVO_API_KEY, SENDER_EMAIL, SENDER_NAME). Emails will be mocked.");
} else {
  brevo = new BrevoClient({ apiKey: brevoApiKey });
}

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  if (!brevo) {
    console.log("[MOCK EMAIL] Would send to:", to, "| Subject:", subject);
    return;
  }

  try {
    console.log("Sending transactional email via Brevo:", {
      to,
      subject,
      senderEmail,
      senderName,
    });

    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: senderEmail!,
        name: senderName!,
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