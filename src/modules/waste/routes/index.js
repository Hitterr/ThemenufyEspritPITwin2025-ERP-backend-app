const express = require("express");
const router = express.Router();
const wasteRoutes = requir("./wasteRoute");
const { verifyToken } = require("../../../middlewares/authMiddleware");
router.use(verifyToken);
router.use("/waste", wasteRoutes);
module.exports = router;
