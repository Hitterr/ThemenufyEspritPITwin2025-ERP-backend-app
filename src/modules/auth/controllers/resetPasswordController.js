const resetPasswordService = require("../services/resetPasswordService");

exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const response = await resetPasswordService.requestPasswordReset(email);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error in requestPasswordReset:", error);
        return res.status(400).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Reset token is required" });
        }
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        const response = await resetPasswordService.resetPassword(token, newPassword);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(400).json({ message: error.message });
    }
};
