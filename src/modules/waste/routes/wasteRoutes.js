const express = require('express');
const router = express.Router();
const wasteController = require('../controllers/wasteController');


router.get('/summary', wasteController.getWasteSummary);


router.get('/trends', wasteController.getWasteTrends);
router.get('/percentage', wasteController.getWastePercentage);

module.exports = router;