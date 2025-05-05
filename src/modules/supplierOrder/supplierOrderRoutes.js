const express = require('express');
const router = express.Router();
const supplierOrderController = require('./supplierOrderController');

// Route to generate purchase order
router.get('/purchase-order/:restaurantId', supplierOrderController.generatePurchaseOrder);

module.exports = router;