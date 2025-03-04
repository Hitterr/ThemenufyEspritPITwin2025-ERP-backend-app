const express = require("express");
const router = express.Router();
const restaurantRoutes = require("./restaurantRoutes");

router.use("/restaurants", restaurantRoutes);
module.exports = router;
