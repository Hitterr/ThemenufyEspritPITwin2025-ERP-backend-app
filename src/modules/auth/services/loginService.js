const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { comparePassword, hashPassword } = require("../../../utils/hash");
const { sendVerificationEmail } = require("../../../utils/mailing");
const userService = require("./userService");
class LoginService {
  // Helper method to check device and send verification if needed
  async verifyDevice(user, deviceId) {
    if (!user.verifiedDevices) {
      user.verifiedDevices = [];
    }
    if (!user.verifiedDevices.includes(deviceId)) {
      // Generate verification token for this device
      const verificationToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          deviceId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      // TODO: Send verification email with the token
      const verificationLink = `${process.env.FRONTEND_URL}/verify-device/${verificationToken}`;
      await sendVerificationEmail(process.env.TEMP_MAIL, verificationLink);
      return false;
    }
    return true;
  }
  // Email & Password login
  async loginWithEmailPassword(email, password, deviceId) {
    try {
      const user = await userService.getUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }
      // Verify device
      const status = await this.verifyDevice(user, deviceId);
      if (!status) {
        return {
          status: false,
          message:
            "Please verify your device to login! We sent you an email with a verification link. ",
        };
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email, deviceId },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      delete user.password;
      return {
        token,
        user,
        deviceId,
      };
    } catch (error) {
      throw error;
    }
  }
  // Google login
  async loginWithGoogle(tokenId, deviceId) {
    try {
      const decodedToken = jwt.decode(tokenId);
      const { email, name, picture, jti } = decodedToken;
      let user = await userService.getUserByEmail(email);
      if (!user) {
        const hashedPassword = await hashPassword(jti);
        user = await User.create({
          email,
          name,
          password: hashedPassword,
          profilePicture: picture,
          authProvider: "google",
          isEmailVerified: true,
          verifiedDevices: [], // Initialize empty devices array
        });
      }
      // Verify device
      const status = await this.verifyDevice(user, deviceId);
      if (!status) {
        return {
          status: false,
          message:
            "Please verify your device to login! We sent you an email with a verification link. ",
        };
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email, deviceId },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      delete user.password;
      return {
        token,
        user,
        deviceId,
      };
    } catch (error) {
      throw new Error("Google authentication failed");
    }
  }
  // Email verification for device
  async verifyEmailForDevice(verificationToken) {
    try {
      const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
      const user = await userService.getUserByEmail(decoded.email);
      if (!user) {
        throw new Error("User not found");
      }
      if (!user.verifiedDevices.includes(decoded.deviceId)) {
        user.verifiedDevices.push(decoded.deviceId);
        await user.save();
      }
      delete user.password;
      return {
        token: verificationToken,
        user,
        deviceId: decoded.deviceId,
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
  // Facebook login
  async loginWithFacebook(accessToken, deviceId) {
    try {
      // Verify Facebook access token and get user data
      const response = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
      );
      const { email, name, id } = response.data;
      let user = await userService.getUserByEmail(email);
      if (!user) {
        // Create new user if doesn't exist
        const hashedPassword = await hashPassword(id);
        user = await User.create({
          email,
          name,
          password: hashedPassword,
          authProvider: "facebook",
          isEmailVerified: true,
          authProvider: "facebook",
        });
      }
      const status = await this.verifyDevice(user, deviceId);
      if (!status) {
        return {
          status: false,
          message:
            "Please verify your device to login! We sent you an email with a verification link. ",
        };
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email, deviceId },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      delete user.password;
      return {
        token,
        user,
        deviceId,
      };
    } catch (error) {
      console.log("📢 [loginService.js:173]", error);
      throw new Error("Facebook authentication failed");
    }
  }
  // Email verification
  async verifyEmail(verificationToken) {
    try {
      const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
      const user = await userService.getUserByEmail(decoded.email);
      if (!user) {
        throw new Error("User not found");
      }
      if (user.isEmailVerified) {
        throw new Error("Email already verified");
      }
      user.isEmailVerified = true;
      await user.save();
      return true;
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
  // Profile
  async getProfile(userId, deviceId) {
    try {
      const user = await userService.getUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (!user.verifiedDevices.includes(deviceId)) {
        throw new Error("Device not verified");
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email, deviceId },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return { token, user, deviceId };
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new LoginService();
