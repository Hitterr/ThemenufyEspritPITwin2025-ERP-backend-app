const express = require("express");
const router = express.Router();
const loginRoutes = require("./loginRoutes");
const deviceRoutes = require("./deviceRoutes");

router.use("/login", loginRoutes);
router.use("/devices", deviceRoutes);
module.exports = router;
