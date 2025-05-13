const express = require("express");
const router = express.Router();
const storageRoutes = require("./routes/index");
const { verifyToken } = require("../../middlewares/authMiddleware");
router.use(verifyToken);
router.use("/", storageRoutes);
module.exports = router;
