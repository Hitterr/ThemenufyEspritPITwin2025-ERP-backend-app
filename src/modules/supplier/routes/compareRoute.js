const express = require('express');
const router = express.Router();
const compareController = require('../controllers/compareController');

router.get('/:ingredientId', compareController.compareSuppliers);

module.exports = router;
