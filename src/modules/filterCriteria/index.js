const express = require("express");
const router = express.Router();
const filterRoutes = require("./routes/filterRoutes");
const { verifyToken } = require("../../middlewares/authMiddleware");
router.use(verifyToken);
router.use("/", filterRoutes);
module.exports = router;
