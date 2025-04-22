const express = require('express');
const router = express.Router();
const { processMessage } = require('../controllers/supplierchatbotController');

router.post('/process', processMessage);

module.exports = router;
