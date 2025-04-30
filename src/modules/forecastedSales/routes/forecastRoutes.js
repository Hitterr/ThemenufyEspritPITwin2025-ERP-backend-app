const express = require("express");
const router = express.Router();
const { getPredictedIngredients } = require("../controllers/forecastController");

router.get("/auto", getPredictedIngredients);

module.exports = router;
