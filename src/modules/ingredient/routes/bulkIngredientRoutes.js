const express = require("express");
const router = express.Router();
const bulkUpdateController = require("../controllers/bulkIngredientController"); // ✅ ce chemin doit être correct

router.put("/bulk", bulkUpdateController.bulkUpdate);

module.exports = router;
