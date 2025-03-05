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
}

module.exports = new ProfileService();
