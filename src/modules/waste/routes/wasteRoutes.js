const express = require("express");
const router = express.Router();
const wasteController = require("../controllers/wasteController");
const { verifyToken } = require("../../../middlewares/authMiddleware");
router.use(verifyToken);
router.get("/summary", wasteController.getWasteSummary);

router.get("/trends", wasteController.getWasteTrends);
router.get("/percentage", wasteController.getWastePercentage);

module.exports = router;
