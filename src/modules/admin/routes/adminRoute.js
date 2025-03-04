const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/restaurant/:restaurantId", adminController.getAllAdmins);
router.get("/:id", adminController.getAdmin);
router.post("/", adminController.createAdmin);
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

module.exports = router;
