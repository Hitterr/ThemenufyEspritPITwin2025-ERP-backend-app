const express = require('express');
const router = express.Router();

router.use('/compare', require('./routes/compareRoute'))

module.exports = router;
