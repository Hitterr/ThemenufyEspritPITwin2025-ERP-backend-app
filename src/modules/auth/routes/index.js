const express = require("express");
const router = express.Router();
const loginRoutes = require("./loginRoutes");
const resetRoutes=require("./resetPasswordRoutes")
const deviceRoutes = require("./deviceRoutes");
const signupRoutes = require("./signupRoutes");
const profileRoutes = require("./profileRoutes");
router.use("/reset-password",resetRoutes)
router.use("/login", loginRoutes);
router.use("/devices", deviceRoutes);
router.use("/signup", signupRoutes);
router.use("/profile", profileRoutes);
module.exports = router;
