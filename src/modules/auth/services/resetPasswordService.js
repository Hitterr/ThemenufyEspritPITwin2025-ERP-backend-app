    const User = require("../models/user");
    const { sendVerifResetPassword } = require("../../../utils/mailing");
    const userService = require("./userService");
    const { generateAccessToken, verifyAccessToken } = require("../../../utils/jwt");
    const { hashPassword } = require("../../../utils/hash");

    class ResetPasswordService {
        // Step 1: Request Password Reset
        async requestPasswordReset(email) {
            try {
                const user = await userService.getUserByEmail(email);
                if (!user) {
                    throw new Error("User not found.");
                }

                // Generate reset token (expires in 1 hour)
                const resetToken = generateAccessToken(
                    { userId: user._id, email: user.email },
                    "1h" // Token expires in 1 hour
                );

                // Store token temporarily in the database (optional, useful for validation)
                user.resetPasswordToken = resetToken;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
                await user.save();

                // Send password reset email
                const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
                await sendVerifResetPassword(user.email, resetLink);

                return { message: "Password reset link sent successfully!" };
            } catch (error) {
                throw new Error(`Error in requestPasswordReset: ${error.message}`);
            }
        }

        // Step 2: Reset Password
        async resetPassword(token, newPassword) {
            try {
                const decoded = verifyAccessToken(token);
                const user = await User.findById(decoded.userId);

                if (!user) {
                    throw new Error("Invalid or expired token.");
                }

                // Optional: Check if the token matches the stored one
                if (!user.resetPasswordToken || user.resetPasswordToken !== token) {
                    throw new Error("Invalid or expired token.");
                }

                // Check if token is expired
                if (user.resetPasswordExpires < Date.now()) {
                    throw new Error("Reset token has expired. Please request a new one.");
                }

                // Hash new password
                user.password = await hashPassword(newPassword);

                // Clear reset token fields after successful reset
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                await user.save();

                return { message: "Password reset successfully!" };
            } catch (error) {
                throw new Error(`Error in resetPassword: ${error.message}`);
            }
        }
    }

    module.exports = new ResetPasswordService();
