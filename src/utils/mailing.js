const nodemailer = require("nodemailer");
const verificationLinkTemplate = require("./templates/emails/verificationLinkTemplate");
const resetPasswordTemplate = require("./templates/emails/resetPasswordTemplate"); // Add this line

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send verification email
const sendVerificationEmail = async (email, verificationLink) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification - Menufy",
      html: verificationLinkTemplate(verificationLink),
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

const sendVerifResetPassword = async (email, verificationLink) => {
  try {
    console.log("Sending email to:", email);
    console.log("Verification link:", verificationLink);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request - Menufy",  // Adjust subject if needed
      html: resetPasswordTemplate(verificationLink),
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendVerifResetPassword,
};
