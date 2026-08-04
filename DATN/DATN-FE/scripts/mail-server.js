import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import twilio from "twilio";

// A lightweight microservice utilizing Nodemailer + Gmail SMTP for real mail alerts
const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURATION 1: Set up your Gmail Account and App Password here
// To generate Gmail App Password, refer to Google Account -> Security -> 2-Step Verification -> App Passwords
const SMTP_EMAIL = process.env.SMTP_EMAIL || "";
const SMTP_APP_PASSWORD = process.env.SMTP_APP_PASSWORD || "";

// CONFIGURATION 2: Set up your Twilio SMS Gateway account here
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_APP_PASSWORD
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log("⚠️ SMTP mail connection warning (could be placeholder credentials)");
  } else {
    console.log("✅ SMTP mail connection ready");
  }
});

let twilioClient = null;
if (TWILIO_ACCOUNT_SID && TWILIO_ACCOUNT_SID !== "your-twilio-account-sid") {
  try {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  } catch (err) {
    console.error("❌ Failed to initialize Twilio client:", err.message);
  }
}

app.post("/api/send-email", async (req, res) => {
  const { to, subject, html } = req.body;
  
  if (!to || !subject || !html) {
    return res.status(400).json({ success: false, error: "Missing required fields (to, subject, html)" });
  }

  console.log(`\n📧 Received request to send email to: ${to}`);
  
  const mailOptions = {
    from: `"FoxStyle Fashion Store" <${SMTP_EMAIL}>`,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully! MessageID: ${info.messageId}`);
    res.json({ success: true, message: "Email sent successfully!", messageId: info.messageId });
  } catch (error) {
    console.error(`❌ SMTP Error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/send-sms", async (req, res) => {
  const { to, otp } = req.body;
  
  if (!to || !otp) {
    return res.status(400).json({ success: false, error: "Missing required fields (to, otp)" });
  }

  console.log(`\n💬 Received request to send SMS OTP to: ${to}`);

  if (!twilioClient) {
    console.log(`⚠️ Twilio is not configured. (Mã OTP giả định cho ${to} là: ${otp})`);
    return res.json({ 
      success: true, 
      message: "Twilio chưa được cấu hình. Đang chạy ở chế độ giả lập.",
      isMock: true,
      otp 
    });
  }

  try {
    const message = await twilioClient.messages.create({
      body: `[FoxStyle Fashion Store] Mã xác thực OTP di động của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
      from: TWILIO_PHONE_NUMBER,
      to: to
    });
    console.log(`✅ SMS sent successfully! SID: ${message.sid}`);
    res.json({ success: true, message: "SMS sent successfully!", sid: message.sid });
  } catch (error) {
    console.error(`❌ Twilio SMS Error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("=========================================");
  console.log(`📨 FoxStyle Nodemailer Server is running!`);
  console.log(`🔗 Email Endpoint: http://localhost:${PORT}/api/send-email`);
  console.log(`🔗 SMS Endpoint: http://localhost:${PORT}/api/send-sms`);
  console.log(`✉️ Configured sender: ${SMTP_EMAIL}`);
  console.log(`💡 Usage: Run 'node scripts/mail-server.js' to start this server`);
  console.log("=========================================");
});
