const express = require("express");
const router = express.Router();
const { getReorderRecommendation, getConsumptionData, getForecastData } = require("../controllers/reorderController");
const { isValidObjectId } = require("mongoose");

const validateIds = (req, res, next) => {
  const { stockId, restaurantId } = req.params;
  if (!isValidObjectId(stockId) || !isValidObjectId(restaurantId)) {
    return res.status(400).json({ error: "Invalid stockId or restaurantId" });
  }
  next();
};

router.get("/reorder/:stockId/:restaurantId", validateIds, getReorderRecommendation);
router.get("/consumption/:stockId/:restaurantId", validateIds, getConsumptionData);
router.get("/forecast/:stockId/:restaurantId", validateIds, getForecastData);

module.exports = router;