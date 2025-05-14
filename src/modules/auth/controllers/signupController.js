const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("@utils/jwt");
const User = require("@/models/user");
const Admin = require("../../../models/admin");
const { default: mongoose } = require("mongoose");
const { signupSchema } = require("../validators/signUpValidator");
const restaurant = require("../../../models/restaurant");
class SignupController {
  async register(req, res) {
    try {
      signupSchema.validateSync(req.body);
      const { firstName, lastName, email, password, phone, address, birthday } =
        req.body;
      const existingUser = await Admin.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Cet email est déjà utilisé." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      let newUser = new Admin({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        address,
        birthday,
      });
      if (req.body.restaurant) {
        const res = await restaurant.create(req.body.restaurant);
        newUser.restaurant = res._id;
      }
      newUser = await newUser.save();
      await newUser.save();
      return res.status(201).json({
        success: true,
        message: "Inscription réussie. Vous pouvez maintenant vous connecter.",
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
