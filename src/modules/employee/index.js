const express = require("express");
const router = express.Router();
const employeeRoutes = require("./routes/employeeRoutes");
const { verifyToken } = require("../../middlewares/authMiddleware");
router.use(verifyToken);
router.use("/", employeeRoutes);
module.exports = router;
