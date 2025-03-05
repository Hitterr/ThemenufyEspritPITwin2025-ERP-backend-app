const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { generateAccessToken, generateRefreshToken } = require("@utils/jwt");
const User = require("@/models/user");
const { userSchema } = require("@modules/user/validators/userValidator");

class SignupController {
  async register(req, res) {
    try {
      await userSchema.validate(req.body, { abortEarly: false });

      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        birthday,
        image,
      } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Cet email est déjà utilisé." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        address,
        birthday,
        image,
        role: "client",
      });

      await newUser.save();

      const accessToken = generateAccessToken({ email: newUser.email });
      const refreshToken = generateRefreshToken({ email: newUser.email });

      newUser.accessToken = accessToken;
      newUser.refreshToken = refreshToken;
      await newUser.save();

      return res.status(201).json({
        success: true,
        message: "Inscription réussie. Vous pouvez maintenant vous connecter.",
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      if (error.name === "ValidationError") {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      return res
        .status(500)
        .json({ success: false, message: "Erreur lors de l'inscription." });
    }
  }
}

module.exports = new SignupController();
