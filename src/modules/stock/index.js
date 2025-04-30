const express = require("express");
const router = express.Router();
const stockRoutes = require("./routes/stockRoutes");
const { verifyToken } = require("../../middlewares/authMiddleware");
// router.use("/", verifyToken, stockRoutes);
router.use("/", stockRoutes);

module.exports = router;
