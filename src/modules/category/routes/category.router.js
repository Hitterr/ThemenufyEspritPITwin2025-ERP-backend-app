const express = require("express");
const controller = require("../controllers/category.controller");

const router = express.Router();

router.post("/", controller.createCategory);
router.get("/", controller.getCategories);
router.get("/:id", controller.getCategoryById);
router.put("/:id", controller.updateCategory);
router.delete("/:id", controller.deleteCategory);

module.exports = router;
