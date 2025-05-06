const stockQRCodeService = require("../services/stock.qrcode.service");

const generateQRCode = async (req, res) => {
  try {
    const { stockId } = req.params;
    const qrCodeDataURL = await stockQRCodeService.generateQRCode(stockId);
    res.status(200).json({
      success: true,
      data: qrCodeDataURL,
      message: "QR code generated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getStockByQRCode = async (req, res) => {
  try {
    const { stockId } = req.params;
    const stock = await stockQRCodeService.getStockByQRCode(stockId);
    res.status(200).json({
      success: true,
      data: stock,
      message: "Stock retrieved successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const addStockToInvoice = async (req, res) => {
  try {
    const { invoiceId, stockId } = req.params;
    const { quantity, price } = req.body;
    const invoiceItem = await stockQRCodeService.addStockToInvoice(
      invoiceId,
      stockId,
      quantity,
      price
    );
    res.status(201).json({
      success: true,
      data: invoiceItem,
      message: "Stock added to invoice successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateQRCode,
  getStockByQRCode,
  addStockToInvoice,
};
