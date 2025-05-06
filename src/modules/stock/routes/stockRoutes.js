const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");
const stockconsumptionController = require("../controllers/stockconsumptionController");
const { getStockAnalysis } = require("../controllers/stock.stats.controller");
const stockQRCodeController = require("../controllers/stock.qrcode.controller");
const { verifyToken } = require("../../../middlewares/authMiddleware");
// Stock management routes
router.get("/:stockId/suppliers", stockController.getSuppliersForStock); 
router.use(verifyToken);
router.post("/", stockController.createStock);
router.get("/", stockController.getAllStocks);
router.get("/stats", getStockAnalysis);
router.get(
	"/getStocksInConsumptionHistory",
	stockconsumptionController.getStocksInConsumptionHistory
);
router.get("/:id", stockController.getStockById);
router.put("/:id", stockController.updateStock);
router.delete("/:id", stockController.deleteStock);
// Quantity management routes
router.patch("/:id/increase", stockController.increaseQuantity);
router.patch("/:id/decrease", stockController.decreaseQuantity);
// QR Code routes
router.get("/:stockId/qrcode", stockQRCodeController.generateQRCode);
router.get("/:stockId/qrcode/scan", stockQRCodeController.getStockByQRCode);
router.post(
	"/invoices/:invoiceId/stock/:stockId",
	stockQRCodeController.addStockToInvoice
);
module.exports = router;
