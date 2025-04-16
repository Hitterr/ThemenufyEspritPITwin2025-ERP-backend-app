const express = require("express");
const router = express.Router();
const invoiceRoutes = require("./routes/invoiceRoutes");
router.use("/", invoiceRoutes);
module.exports = router;
