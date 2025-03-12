const User = require("../../../models/user");
const resetPasswordService = require("../services/resetPasswordService");
exports.requestPasswordReset = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) {
			return res.status(400).json({ message: "Email is required" });
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const response = await resetPasswordService.requestPasswordReset(user);
		return res.status(200).json(response);
	} catch (error) {
		console.error("Error in requestPasswordReset:", error);
		return res
			.status(500)
			.json({ message: error.message || "Internal Server Error" });
	}
};
exports.verifyCode = async (req, res) => {
	try {
		const { email, resetCode } = req.body;
		if (!email || !resetCode) {
			return res.status(400).json({ message: "Email and code are required" });
		}
		const response = await resetPasswordService.verifyCode(email, resetCode);
		if (!response.success) {
			return res.status(400).json({ success: false, message: response.message });
		}
		return res.status(200).json({ success: true, message: response.message });
	} catch (error) {
		console.error("Error in verifyCode:", error);
		return res
			.status(500)
			.json({ message: error.message || "Internal Server Error" });
	}
};
exports.resetPassword = async (req, res) => {
	try {
		const { email, resetCode, newPassword } = req.body;
		if (!email || !resetCode || !newPassword) {
			return res.status(400).json({ message: "All fields are required" });
		}
		const response = await resetPasswordService.resetPassword(
			email,
			resetCode,
			newPassword
		);
		if (!response.success) {
			return res.status(400).json({ message: response.message });
		}
		return res.status(200).json({ message: response.message });
	} catch (error) {
		console.error("Error in resetPassword controller:", error);
		return res
			.status(500)
			.json({ message: error.message || "Internal Server Error" });
	}
};
