const express = require("express");
const router = express.Router();
const loginRoutes = require("./loginRoutes");
const userRoutes = require("./userRoutes");
router.use("/login", loginRoutes);
router.use("/users", userRoutes);
module.exports = router;
