const express = require("express");
const router = express.Router();
const filterRoutes = require("./routes/filterRoutes");
router.use("/", filterRoutes);

module.exports = router;
