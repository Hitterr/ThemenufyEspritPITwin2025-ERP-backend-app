const User = require("../../../models/user");
const jwt = require("jsonwebtoken");

class ProfileService {
  async updateProfile(userId, updateData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .select(["-password"])
        .populate("restaurant");

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid token");
      }
      if (error.name === "TokenExpiredError") {
        throw new Error("Token expired");
      }
      throw error;
    }
  }
  
  async updatePassword(userId, { currentPassword, newPassword }) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProfileService();
