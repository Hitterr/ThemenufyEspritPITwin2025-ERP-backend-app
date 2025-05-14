const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const invoiceItemController = require("../controllers/invoiceItemController");
const authMiddleware = require("@middlewares/authMiddleware");

// Invoice routes
router.get("/stats", invoiceController.getInvoiceStats);
router.post("/", invoiceController.createInvoice);
router.get("/", invoiceController.getInvoices);
router.get("/:invoiceId", invoiceController.getInvoice);
router.delete("/:invoiceId", invoiceController.deleteInvoice);
// Update Invoice Status && Paid Status
router.patch("/:invoiceId/status", invoiceController.updateInvoiceStatus);
router.post(
  "/:invoiceId/paid-status",
  invoiceController.updateInvoicePaidStatus
);

// Invoice items routes
router.get("/:invoiceId/items", invoiceItemController.getInvoiceItems);
router.post("/:invoiceId/items", invoiceItemController.addInvoiceItem);
router.put("/items/:itemId", invoiceItemController.updateInvoiceItem);
router.delete("/items/:itemId", invoiceItemController.deleteInvoiceItem);

module.exports = router;
