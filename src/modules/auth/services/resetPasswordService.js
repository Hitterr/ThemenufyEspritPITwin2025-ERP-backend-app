const crypto = require("crypto");
const User = require("../models/user");
const { sendVerifResetPassword } = require("../../../utils/mailing");
const { hashPassword } = require("../../../utils/hash");

exports.requestPasswordReset = async (user) => {
  try {
    const verificationCode = crypto.randomBytes(3).toString("hex");
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

    const emailSent = await sendVerifResetPassword(
      user.email,
      verificationCode
    );
    if (!emailSent) {
      throw new Error("Failed to send the verification email");
    }

    // Update nested fields
    user.forgotPasswordVerif = {
      ...user.forgotPasswordVerif, // Preserve other fields if they exist
      resetCode: verificationCode,
      resetCodeExpires: resetCodeExpires,
    };
    await user.save();

    return {
      success: true,
      message: "A verification code has been sent to your email",
    };
  } catch (error) {
    console.error("Error in requestPasswordReset service:", error);
    throw error;
  }
};

exports.verifyCode = async (email, resetCode) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Access nested resetCode
    if (user.forgotPasswordVerif.resetCode !== resetCode) {
      return { success: false, message: "Invalid verification code" };
    }

    // Access nested resetCodeExpires
    if (new Date() > user.forgotPasswordVerif.resetCodeExpires) {
      return { success: false, message: "Verification code has expired" };
    }

    return { success: true, message: "Code verified successfully" };
  } catch (error) {
    console.error("Error in verifyCode service:", error);
    throw new Error("Error verifying code");
  }
};

exports.resetPassword = async (email, resetCode, newPassword) => {
  try {
    console.log("Resetting password for:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return { success: false, message: "User not found" };
    }

    // Access nested fields
    console.log(
      "Current resetCode in DB:",
      user.forgotPasswordVerif.resetCode,
      "Provided:",
      resetCode
    );
    if (user.forgotPasswordVerif.resetCode !== resetCode) {
      console.log("Invalid reset code");
      return { success: false, message: "Invalid verification code" };
    }

    console.log(
      "Expiration check:",
      new Date(),
      "vs",
      user.forgotPasswordVerif.resetCodeExpires
    );
    if (new Date() > user.forgotPasswordVerif.resetCodeExpires) {
      console.log("Code expired");
      return { success: false, message: "Verification code has expired" };
    }

    console.log("Password before reset:", user.password);
    const hashedPassword = await hashPassword(newPassword);
    console.log("New hashed password (after reset):", hashedPassword);

    user.password = hashedPassword;
    // Clear nested verification fields
    user.forgotPasswordVerif.resetCode = null;
    user.forgotPasswordVerif.resetCodeExpires = null;
    console.log("User before save:", user);

    await user.save();
    console.log("User saved successfully");

    // Verify the save
    const updatedUser = await User.findOne({ email });
    console.log("User after save (from DB):", updatedUser);

    return { success: true, message: "Password has been successfully reset" };
  } catch (error) {
    console.error("Error in resetPassword service:", error);
    throw new Error("Error resetting the password");
  }
};
