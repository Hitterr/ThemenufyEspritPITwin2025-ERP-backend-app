const express = require('express');
const router = express.Router();
const wasteController = require('../controllers/wasteController');


router.get('/summary', wasteController.getWasteSummary);


router.get('/trends', wasteController.getWasteTrends);

module.exports = router;