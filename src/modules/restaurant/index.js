const express = require("express");
const router = express.Router();
const restaurantRoutes = require("./routes");
const { verifyToken } = require("../../middlewares/authMiddleware");
router.use(verifyToken);
router.use("/", restaurantRoutes);
module.exports = router;
