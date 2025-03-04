const express = require("express");
const router = express.Router();
const loginRoutes = require("./loginRoutes");
const userRoutes = require("./userRoutes");
const resetRoutes=require("./resetPasswordRoutes")
router.use("/login", loginRoutes);
router.use("/users", userRoutes);
router.use("/reset-password",resetRoutes)
module.exports = router;
