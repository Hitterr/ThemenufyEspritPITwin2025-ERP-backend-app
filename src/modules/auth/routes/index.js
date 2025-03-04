const express = require("express");
const router = express.Router();
const loginRoutes = require("./loginRoutes");
const userRoutes = require("./userRoutes");
const deviceRoutes = require('./deviceRoutes');

router.use("/login", loginRoutes);
router.use("/users", userRoutes);
router.use('/devices', deviceRoutes);
module.exports = router;
