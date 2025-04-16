const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const authMiddleware = require("@middlewares/authMiddleware");

router.post(
  "/invoices",
  authMiddleware.verifyToken,
  invoiceController.createInvoice
);
router.get(
  "/invoices/:invoiceId",
  authMiddleware.verifyToken,
  invoiceController.getInvoice
);

module.exports = router;
