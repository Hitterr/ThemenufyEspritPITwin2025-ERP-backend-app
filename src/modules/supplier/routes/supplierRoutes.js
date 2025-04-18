// @modules/supplier/routes/supplierRoutes.js
const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const {
  validateSupplier,
  validateSupplierId,
  validateSupplierIngredient,
  validateIngredientId,
} = require("../validators/supplierValidators");
const { body, param, validationResult } = require("express-validator");

// Test route
router.get("/test", (req, res) =>
  res.json({ message: "Supplier route working" })
);

// Stats route (static, defined early)
router.get("/stats", supplierController.getSupplierStats);

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

// Supplier-ingredient relationship routes (nested under supplierId)
router.post(
  "/:supplierId/ingredients",
  validateSupplierId,
  validateSupplierIngredient,
  supplierController.linkIngredient
);
router.get(
  "/:supplierId/ingredients",
  validateSupplierId,
  supplierController.getSupplierIngredients
);
router.delete(
  "/:supplierId/ingredients/:ingredientId",
  validateSupplierId,
  validateIngredientId,
  supplierController.unlinkIngredient
);
router.patch(
  "/:supplierId/ingredients/bulk",
  validateSupplierId,
  [
    body("ingredients")
      .isArray({ min: 1 })
      .withMessage("Ingredients must be a non-empty array"),
    body("ingredients.*.ingredientId")
      .isMongoId()
      .withMessage("Invalid ingredient ID"),
    body("ingredients.*.pricePerUnit")
      .isFloat({ min: 0 })
      .withMessage("Price per unit must be a positive number"),
    body("ingredients.*.leadTimeDays")
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
  supplierController.bulkUpdateSupplierIngredients
);

// Ingredient-related route (dynamic, require ingredientId)
router.get(
  "/ingredient/:ingredientId",
  [
    param("ingredientId").isMongoId().withMessage("Invalid ingredient ID"),
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
  supplierController.getSuppliersByIngredient
);

module.exports = router;
