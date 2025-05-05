const supplierOrderService = require('./supplierOrderService');
const CustomError = require('../../utils/errors');
const path = require('path');

const generatePurchaseOrder = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { format } = req.query;

    if (!restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new CustomError('Invalid restaurant ID', 400);
    }

    const result = await supplierOrderService.generatePurchaseOrder(restaurantId, format || 'pdf');

    if (format === 'json') {
      res.status(200).json({
        success: true,
        message: 'Purchase order data retrieved',
        orders: result.orders,
      });
    } else {
      res.setHeader('Content-Disposition', `attachment; filename=${path.basename(result.filePath)}`);
      res.setHeader(
        'Content-Type',
        format === 'xlsx'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf'
      );
      res.sendFile(result.filePath, (err) => {
        if (err) {
          next(new CustomError('Error sending file', 500));
        }
      });
    }
  } catch (error) {
    console.error(`Error generating purchase order: ${error.message}`);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

module.exports = {
  generatePurchaseOrder,
};