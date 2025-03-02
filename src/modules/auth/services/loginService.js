const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const { comparePassword } = require("../../../utils/hash");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class LoginService {
	// Email & Password login
	async loginWithEmailPassword(email, password) {
		try {
			const user = await User.findOne({ email });
			if (!user) {
				throw new Error("User not found");
			}
			const isValidPassword = await comparePassword(password, user.password);
			if (!isValidPassword) {
				throw new Error("Invalid credentials");
			}
			const token = jwt.sign(
				{ userId: user._id, email: user.email },
				process.env.JWT_SECRET,
				{ expiresIn: "24h" }
			);
			return {
				token,
				user: {
					id: user._id,
					email: user.email,
					name: user.name,
					role: user.role,
				},
			};
		} catch (error) {
			throw error;
		}
	}
	// Google login
	async loginWithGoogle(tokenId) {
		try {
			const ticket = await googleClient.verifyIdToken({
				idToken: tokenId,
				audience: process.env.GOOGLE_CLIENT_ID,
			});
			const { email, name, picture } = ticket.getPayload();
			let user = await User.findOne({ email });
			if (!user) {
				// Create new user if doesn't exist
				user = await User.create({
					email,
					name,
					profilePicture: picture,
					isVerified: true,
					authProvider: "google",
				});
			}
			const token = jwt.sign(
				{ userId: user._id, email: user.email },
				process.env.JWT_SECRET,
				{ expiresIn: "24h" }
			);
			return {
				token,
				user: {
					id: user._id,
					email: user.email,
					name: user.name,
					role: user.role,
				},
			};
		} catch (error) {
			throw new Error("Google authentication failed");
		}
	}
	// Facebook login
	async loginWithFacebook(accessToken) {
		try {
			// Verify Facebook access token and get user data
			const response = await axios.get(
				`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
			);
			const { email, name } = response.data;
			let user = await User.findOne({ email });
			if (!user) {
				// Create new user if doesn't exist
				user = await User.create({
					email,
					name,
					isVerified: true,
					authProvider: "facebook",
				});
			}
			const token = jwt.sign(
				{ userId: user._id, email: user.email },
				process.env.JWT_SECRET,
				{ expiresIn: "24h" }
			);
			return {
				token,
				user: {
					id: user._id,
					email: user.email,
					name: user.name,
					role: user.role,
				},
			};
		} catch (error) {
			throw new Error("Facebook authentication failed");
		}
	}
	// Email verification
	async verifyEmail(verificationToken) {
		try {
			const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
			const user = await User.findOne({ email: decoded.email });
			if (!user) {
				throw new Error("User not found");
			}
			if (user.isVerified) {
				throw new Error("Email already verified");
			}
			user.isVerified = true;
			await user.save();
			return {
				message: "Email verified successfully",
				user: {
					id: user._id,
					email: user.email,
					name: user.name,
					role: user.role,
				},
			};
		} catch (error) {
			if (error.name === "JsonWebTokenError") {
				throw new Error("Invalid verification token");
			}
			if (error.name === "TokenExpiredError") {
				throw new Error("Verification token has expired");
			}
			throw error;
		}
	}
}
module.exports = new LoginService();
