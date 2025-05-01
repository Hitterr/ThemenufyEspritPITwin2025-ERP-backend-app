const express = require("express");
const router = express.Router();
const invoiceRoutes = require("./routes/invoiceRoutes");
const invoiceItemRoutes = require("./routes/invoiceRoutes");
const { verifyToken } = require("../../middlewares/authMiddleware");
router.use(verifyToken);
router.use("/", invoiceRoutes);
router.use("/", invoiceItemRoutes);
module.exports = router;
