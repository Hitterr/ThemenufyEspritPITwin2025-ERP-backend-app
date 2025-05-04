const express = require("express");
const router = express.Router();
const { getPredictedStocks } = require("../controllers/forecastController");

router.get("/auto", getPredictedStocks);

module.exports = router;
