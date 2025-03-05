const express = require("express");
const router = express.Router();
const loginRoutes = require("./loginRoutes");
const deviceRoutes = require("./deviceRoutes");
const signupRoutes = require("./signupRoutes");

router.use("/login", loginRoutes);
router.use("/devices", deviceRoutes);
router.use("/signup", signupRoutes);
module.exports = router;
