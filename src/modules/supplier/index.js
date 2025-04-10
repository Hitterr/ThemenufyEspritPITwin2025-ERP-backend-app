const express = require("express");
const router = express.Router();
const supplierRoutes = require("./routes/supplierRoute");

router.use("/", supplierRoutes);

module.exports = router;