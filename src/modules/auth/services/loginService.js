const User = require("../../../models/user");
const SuperAdmin = require("../../../models/superAdmin");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { comparePassword, hashPassword } = require("../../../utils/hash");
const { sendVerificationEmail } = require("../../../utils/mailing");
const userService = require("../../user/services/userService");
const superAdmin = require("../../../models/superAdmin");
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
      const superadmin = await SuperAdmin.findOne({ email });
      if (!user && !superadmin) {
        throw new Error("Invalid credentials");
      }
      if (superadmin) {
        const isValidPassword = await comparePassword(
          password,
          superadmin.password
        );
        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }
        if (!superadmin.verifiedDevices.includes(deviceId))
          superadmin.verifiedDevices.push(deviceId);
        await superadmin.save();
        delete superadmin.password;
        const token = jwt.sign(
          { userId: superadmin._id, email: superadmin.email, deviceId },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        delete superadmin.password;
        return {
          token,
          user: superadmin,
          deviceId,
        };
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
      // Step 1: Fetch Google profile data using Axios
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenId}`,
          },
        }
      );
      const profileData = response.data;
      console.log(
        "🔍 ~ loginWithGoogle ~ src/modules/auth/services/loginService.js:70 ~ profileData:",
        profileData
      );
      const { email, given_name, family_name, picture, sub } = profileData;
      // Step 2: Check if the user exists in the database
      let user = await userService.getUserByEmail(email);
      if (!user) {
        // If the user doesn't exist, create a new user
        const hashedPassword = await hashPassword(sub); // Use `sub` (unique identifier) as the password seed
        user = await User.create({
          email,
          firstName: given_name,
          lastName: family_name,
          password: hashedPassword,
          image: picture,
          authProvider: "google",
          isEmailVerified: true,
          verifiedDevices: [], // Initialize empty devices array
        });
      }
      // Step 3: Verify the device
      const status = await this.verifyDevice(user, deviceId);
      if (!status) {
        return {
          status: false,
          message:
            "Please verify your device to login! We sent you an email with a verification link.",
        };
      }
      // Step 4: Generate a JWT token for the user
      const token = jwt.sign(
        { userId: user._id, email: user.email, deviceId },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      // Remove sensitive data before returning the user object
      delete user.password;
      return {
        token,
        user,
        deviceId,
      };
    } catch (error) {
      console.error("Error during Google authentication:", error);
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
        `https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token=${accessToken}`
      );
      const { email, first_name, last_name, id } = response.data;
      let user = await userService.getUserByEmail(email);
      if (!user) {
        // Create new user if doesn't exist
        const hashedPassword = await hashPassword(id);
        user = await User.create({
          email,
          firstName: first_name,
          lastName: last_name,
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
      const superadmin = await superAdmin.findById(userId);
      if (!user && !superadmin) {
        throw new Error("User not found");
      }
      console.log(
        "🔍 ~ loginWithGoogle ~ src/modules/auth/services/loginService.js:70 ~ profileData:",
        superadmin
      );
      if (superadmin) {
        delete superadmin.password;
        if (!superadmin.verifiedDevices.includes(deviceId)) {
          superAdmin.verifiedDevices.push(deviceId);
          await superadmin.save();
        }
        const token = jwt.sign(
          { userId: superadmin._id, email: superadmin.email, deviceId },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        return { token, user: superadmin, deviceId };
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
