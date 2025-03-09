const nodemailer = require("nodemailer");
const verificationLinkTemplate = require("./templates/emails/verificationLinkTemplate");
const resetPasswordTemplate = require("./templates/emails/resetPasswordTemplate");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

const sendVerifResetPassword = async (email, verificationCode) => {
  try {
    console.log(`Verification code for ${email}: ${verificationCode}`);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset - Menufy", // Updated subject
      html: resetPasswordTemplate(verificationCode), // Use the new template
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendVerifResetPassword,
};
