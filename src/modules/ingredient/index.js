const express = require("express");
const router = express.Router();
const ingredientRoutes = require("./routes/ingredientRoutes");
<<<<<<< HEAD
const { verifyToken } = require("../../middlewares/authMiddleware");
// router.use("/", verifyToken, ingredientRoutes);
router.use("/", ingredientRoutes);
=======
const bulkRoutes = require("./routes/bulkIngredientRoutes");

const { verifyToken } = require("../../middlewares/authMiddleware");
// router.use("/", verifyToken, ingredientRoutes);
router.use("/", ingredientRoutes);
router.use("/", bulkRoutes); 

>>>>>>> c14d2f4d9e9e3519ad4f71c61c32abb70228779f
module.exports = router;
