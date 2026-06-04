import * as nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL for port 465
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // 💡 FORCE NODEMAILER TO USE IPv4 ROUTING ONLY
  connectionTimeout: 10000, // 10 seconds timeout
  greetingTimeout: 5000,
  dnsTimeout: 5000,
});

const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };
    console.log(mailOptions);

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
  // console.log(process.eEMAIL_USER);

};

export default sendEmail;
