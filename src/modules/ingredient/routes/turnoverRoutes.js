const express = require('express');
const router = express.Router();
const { fetchTurnoverStats ,getIngredientHistoryChart} = require('../controllers/turnoverController');

router.get('/turnover', fetchTurnoverStats);
router.get('/turnover/history/:ingredientId', getIngredientHistoryChart);

module.exports = router;
