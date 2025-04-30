const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");
const { getStockAnalysis } = require("../controllers/stock.stats.controller");
// Existing routes
router.post("/", ingredientController.createIngredient);
router.get("/", ingredientController.getAllIngredients);
router.get("/stats", getStockAnalysis);
router.get("/:id", ingredientController.getIngredientById);
router.put("/:id", ingredientController.updateIngredient);
router.delete("/:id", ingredientController.deleteIngredient);
// New quantity management routes
router.patch("/:id/increase", ingredientController.increaseQuantity);
router.patch("/:id/decrease", ingredientController.decreaseQuantity);
module.exports = router;
