const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
// const { authenticateToken } = require("../middleware/auth");

// Routes publiques
router.post("/", restaurantController.createRestaurant);

// Routes protégées (ajoute authenticateToken si nécessaire)
// router.use(authenticateToken);
router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantById);
router.put("/:id", restaurantController.updateRestaurant);
router.delete("/:id", restaurantController.deleteRestaurant);

module.exports = router;
