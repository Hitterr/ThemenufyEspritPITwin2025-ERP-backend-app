const { loginService } = require("../services");
const yup = require("yup");
// Validation schemas
const emailPasswordSchema = yup.object({
	email: yup
		.string()
		.email("Invalid email format")
		.required("Email is required"),
	password: yup
		.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
});
const googleSchema = yup.object({
	tokenId: yup.string().required("Google token is required"),
});
const facebookSchema = yup.object({
	accessToken: yup.string().required("Facebook access token is required"),
});
class LoginController {
	// Handle email/password login
	async loginWithEmailPassword(req, res) {
		try {
			// Validate request body
			await emailPasswordSchema.validate(req.body, { abortEarly: false });
			const { email, password } = req.body;
			const result = await loginService.loginWithEmailPassword(email, password);
			return res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				return res.status(400).json({
					success: false,
					message: "Validation error",
					errors: error.errors,
				});
			}
			return res.status(401).json({
				success: false,
				message: error.message || "Authentication failed",
			});
		}
	}
	// Handle Google login
	async loginWithGoogle(req, res) {
		try {
			// Validate request body
			await googleSchema.validate(req.body, { abortEarly: false });
			const { tokenId } = req.body;
			const result = await loginService.loginWithGoogle(tokenId);
			return res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				return res.status(400).json({
					success: false,
					message: "Validation error",
					errors: error.errors,
				});
			}
			return res.status(401).json({
				success: false,
				message: error.message || "Google authentication failed",
			});
		}
	}
	// Handle Facebook login
	async loginWithFacebook(req, res) {
		try {
			// Validate request body
			await facebookSchema.validate(req.body, { abortEarly: false });
			const { accessToken } = req.body;
			const result = await loginService.loginWithFacebook(accessToken);
			return res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				return res.status(400).json({
					success: false,
					message: "Validation error",
					errors: error.errors,
				});
			}
			return res.status(401).json({
				success: false,
				message: error.message || "Facebook authentication failed",
			});
		}
	}
    // Handle email verification
    async verifyEmail(req, res) {
        try {
            const { token } = req.params;
            const result = await loginService.verifyEmail(token);
            
            return res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Email verification failed"
            });
        }
    }
}
module.exports = new LoginController();
