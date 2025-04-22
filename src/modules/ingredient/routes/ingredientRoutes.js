const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");

// Existing routes
router.post("/", ingredientController.createIngredient);
router.get("/", ingredientController.getAllIngredients);
router.get("/:id", ingredientController.getIngredientById);
router.put("/:id", ingredientController.updateIngredient);
router.delete("/:id", ingredientController.deleteIngredient);

// New quantity management routes
router.patch("/:id/increase", ingredientController.increaseQuantity);
router.patch("/:id/decrease", ingredientController.decreaseQuantity);

<<<<<<< HEAD
=======

>>>>>>> c14d2f4d9e9e3519ad4f71c61c32abb70228779f
module.exports = router;