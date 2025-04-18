const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const invoiceItemController = require("../controllers/invoiceItemController");
const authMiddleware = require("@middlewares/authMiddleware");

// Invoice routes
router.post("/", authMiddleware.verifyToken, invoiceController.createInvoice);
router.get("/", authMiddleware.verifyToken, invoiceController.getInvoices);
router.get("/:invoiceId", authMiddleware.verifyToken, invoiceController.getInvoice);
router.patch("/:invoiceId/status", authMiddleware.verifyToken, invoiceController.updateInvoiceStatus);

// Invoice items routes
router.post("/:invoiceId/items", authMiddleware.verifyToken, invoiceItemController.addInvoiceItem);
router.put("/items/:itemId", authMiddleware.verifyToken, invoiceItemController.updateInvoiceItem);
router.delete("/items/:itemId", authMiddleware.verifyToken, invoiceItemController.deleteInvoiceItem);

module.exports = router;
