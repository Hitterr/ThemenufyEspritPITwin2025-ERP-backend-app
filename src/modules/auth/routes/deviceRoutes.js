const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { verifyToken } = require('../../../middlewares/authMiddleware');

router.delete('/', verifyToken, deviceController.removeDevices);

module.exports = router;