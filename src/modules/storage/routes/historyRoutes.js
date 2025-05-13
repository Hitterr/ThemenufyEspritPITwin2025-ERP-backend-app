const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");
const PriceHistoryController = require("../controllers/PriceHistoryController");

router.post("/consumptions", historyController.createConsumption);
router.get("/consumptions", historyController.getConsumption);
router.get("/trends/daily/:restaurantId", historyController.getDailyTrends);

router.post("/Prices", PriceHistoryController.createPriceHistory);
router.get("/trends", PriceHistoryController.getPriceHistories);
router.get(
  "/trends/daily/:stockId/:restaurantId",
  PriceHistoryController.getDailyPriceTrends
);

module.exports = router;
