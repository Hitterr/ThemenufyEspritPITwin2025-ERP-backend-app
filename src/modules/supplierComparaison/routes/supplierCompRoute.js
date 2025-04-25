const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierComparController");

router.get("/compare", supplierController.compareSuppliers);

module.exports = router;