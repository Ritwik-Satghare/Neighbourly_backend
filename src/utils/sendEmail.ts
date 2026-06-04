import * as nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for secure port 465, false for alternative port 587
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // cloud container connection settings
  connectionTimeout: 10000, // 10 seconds connection timeout
  greetingTimeout: 5000,     // 5 seconds greeting timeout
  dnsTimeout: 5000,          // 5 seconds DNS resolution timeout
});

const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    console.log("Attempting outbound email payload routing:", mailOptions);

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully over secure IPv4 channel");
  } catch (error) {
    console.error("Error encountered inside transporter.sendMail execution:", error);
    throw error; // Bubble error up to authController catch block safely
  }
};

export default sendEmail;