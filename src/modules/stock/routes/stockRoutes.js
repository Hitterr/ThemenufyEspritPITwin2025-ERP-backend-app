const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");
const stockconsumptionController = require("../controllers/stockconsumptionController");

const { getStockAnalysis } = require("../controllers/stock.stats.controller");
const { verifyToken } = require("../../../middlewares/authMiddleware");
// Stock management routes
router.use(verifyToken);
router.post("/", stockController.createStock);
router.get("/", stockController.getAllStocks);
router.get("/stats", getStockAnalysis);
router.get("/getStocksInConsumptionHistory", stockconsumptionController.getStocksInConsumptionHistory);

router.get("/:id", stockController.getStockById);
router.put("/:id", stockController.updateStock);
router.delete("/:id", stockController.deleteStock);
// Quantity management routes
router.patch("/:id/increase", stockController.increaseQuantity);
router.patch("/:id/decrease", stockController.decreaseQuantity);



module.exports = router;
