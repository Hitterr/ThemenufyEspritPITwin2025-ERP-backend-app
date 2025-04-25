const express = require("express");
const router = express.Router();
const ingredientRoutes = require("./routes/ingredientRoutes");
const bulkRoutes = require("./routes/bulkIngredientRoutes");
const { verifyToken } = require("../../middlewares/authMiddleware");
// router.use("/", verifyToken, ingredientRoutes);
router.use("/", ingredientRoutes);
router.use("/", bulkRoutes); 
module.exports = router;
