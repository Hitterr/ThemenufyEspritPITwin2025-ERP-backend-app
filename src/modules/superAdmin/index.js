const express = require("express");
const router = express.Router();
const superadminRoutes = require("./routes/superadminRoutes");
const { verifyToken } = require("../../middlewares/authMiddleware");
router.use(verifyToken);
router.use("/", superadminRoutes);
module.exports = router;
