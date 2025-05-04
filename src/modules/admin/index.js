const express = require("express");
const router = express.Router();
const adminRoutes = require("./routes/adminRoute");
const { verifyToken } = require("../../middlewares/authMiddleware");
router.use(verifyToken);
router.use("/", adminRoutes);
module.exports = router;
