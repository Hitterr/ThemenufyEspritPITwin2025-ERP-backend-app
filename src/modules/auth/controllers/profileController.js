const profileService = require("../services/profileService");
const { profileUpdateSchema } = require("../validators/profileValidator");

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    let updateData = req.body;
    updateData = profileUpdateSchema.validateSync(updateData, {
      stripUnknown: true,
    });
    const updatedProfile = await profileService.updateProfile(
      userId,
      updateData
    );
    res.status(200).json({
      success: true,
      data: updatedProfile,
      message: "profile updated ! ",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateProfile,
};
