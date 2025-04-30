const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const {
  validateSupplier,
  validateSupplierId,
  validateSupplierStock,
  validateStockId,
} = require("../validators/supplierValidators");
const { body, validationResult } = require("express-validator");

// Test route
router.get("/test", (req, res) =>
  res.status(200).json({ success: true, message: "Supplier route working" })
);

// Stats route (static, defined early)
router.get("/stats", supplierController.getSupplierStats);

// New route for delivery stats
router.get("/delivery-stats", supplierController.getTopSuppliersByDeliveryTime);

// Supplier CRUD routes (static)
router.post("/", validateSupplier, supplierController.createSupplier);
router.get("/", supplierController.getAllSuppliers);

// Supplier CRUD routes (dynamic, require supplierId)
router.get(
  "/:supplierId",
  validateSupplierId,
  supplierController.getSupplierById
);
router.put(
  "/:supplierId",
  validateSupplierId,
  validateSupplier,
  supplierController.updateSupplier
);
router.delete(
  "/:supplierId",
  validateSupplierId,
  supplierController.deleteSupplier
);

// Supplier-stock relationship routes (nested under supplierId)
router.post(
  "/:supplierId/link-stock",
  validateSupplierId,
  validateSupplierStock,
  supplierController.linkStock
);
router.post(
  "/:supplierId/stocks",
  validateSupplierId,
  validateSupplierStock,
  supplierController.linkStock
);
router.get(
  "/:supplierId/stocks",
  validateSupplierId,
  supplierController.getSupplierStocks
);
router.delete(
  "/:supplierId/stocks/:stockId",
  validateSupplierId,
  validateStockId,
  supplierController.unlinkStock
);
router.patch(
  "/:supplierId/stocks/bulk",
  validateSupplierId,
  [
    body("stocks")
      .isArray({ min: 1 })
      .withMessage("Stocks must be a non-empty array"),
    body("stocks.*.stockId").isMongoId().withMessage("Invalid stock ID"),
    body("stocks.*.pricePerUnit")
      .isFloat({ min: 0 })
      .withMessage("Price per unit must be a positive number"),
    body("stocks.*.leadTimeDays")
      .isInt({ min: 1 })
      .withMessage("Lead time must be a positive integer"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          details: errors.array(),
        });
      }
      next();
    },
  ],
  supplierController.bulkUpdateSupplierStocks
);

module.exports = router;
