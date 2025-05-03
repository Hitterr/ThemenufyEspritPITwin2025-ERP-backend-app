const express = require("express");
const router = express.Router();
const filterController = require("../controllers/filterController");
const authMiddleware = require("@middlewares/authMiddleware");
router.get("/", authMiddleware.verifyToken, filterController.filterInvoices);

module.exports = router;
