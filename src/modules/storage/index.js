const express = require("express");
const router = express.Router();
const storageRoutes = require("./routes/index");

router.use("/", storageRoutes);
module.exports = router;