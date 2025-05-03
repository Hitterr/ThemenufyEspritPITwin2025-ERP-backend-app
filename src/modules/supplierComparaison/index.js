const express = require("express");
const router = express.Router();
const supplierRoutes = require("./routes/supplierCompRoute");
const { verifyToken } = require("../../middlewares/authMiddleware");
router.use(verifyToken);
router.use("/", supplierRoutes);
module.exports = router;
