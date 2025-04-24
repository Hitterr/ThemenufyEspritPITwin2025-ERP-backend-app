const express = require("express");
const router = express.Router();
const invoiceRoutes = require("./routes/invoiceRoutes");
const invoiceItemRoutes = require("./routes/invoiceRoutes");
router.use("/", invoiceRoutes);
router.use("/", invoiceItemRoutes);
module.exports = router;
