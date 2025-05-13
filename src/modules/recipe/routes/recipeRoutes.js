const express = require("express");
const router = express.Router();
const RecipeController = require("../controller/recipeController");

router.get("/", RecipeController.getAllRecipes); 

module.exports = router;