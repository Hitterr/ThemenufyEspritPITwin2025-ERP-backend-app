const express = require("express");
const router = express.Router();
const supplierRoutes = require("./routes/supplierCompRoute");

router.use("/", supplierRoutes);

module.exports = router;