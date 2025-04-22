const express = require('express');
const router = express.Router();
const { processMessage } = require('../controllers//chatbotController');

router.post('/process', processMessage);

module.exports = router;
