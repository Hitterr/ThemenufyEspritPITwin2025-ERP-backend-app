const jwt = require("jsonwebtoken");
const userService = require("../modules/user/services/userService");
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const existedUser = await userService.getUserById(req.user.userId);
    req.user.details = existedUser;
    // console.log(
    // 	"🔍 ~  ~ src/middlewares/authMiddleware.js:17 ~ req.user:",
    // 	req.user
    // );
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
module.exports = { verifyToken };
