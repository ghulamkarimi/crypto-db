import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "adelnamazi61@gmail.com",
    pass: process.env.PASSMAIL,
  },
});

export const sendVerificationLinkToEmail = async (
  email: string,
  firstName: string,
  verificationCode: number
) => {
  const mailOptions = {
    from: "adelnamazi61@gmail.com",
    to: email,
    subject: "Verify Your Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <div style="box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); background-color: #333333; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://orosia.online/src/assets/images/logo.png" alt="brand" width="120" height="120"/>
          </div>
          <p style="font-size: 24px; font-weight: bold; color: #eab308;">Dear ${firstName},</p>
          <p style="font-size: 24px; font-weight: bold; color: #eab308;">Thank you for signing up. Please click the following link to verify your account:</p>
          <div style="background-color: #007bff; padding: 1px; border-radius: 5px; text-align: center;">
            <p style="font-size: 36px; font-weight: bold; color: #ffffff;">${verificationCode}</p>
          </div>
          <p style="color: #eab308;">If you did not sign up, please ignore this email.</p>
          <p style="color: #eab308;">Best Regards,<br/>orosia.online Team</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email.");
  }
};
