const QRCode = require("qrcode");
const Stock = require("@models/stock");
const mongoose = require("mongoose");

class StockQRCodeService {
  async generateQRCode(stockId) {
    try {
      console.log(`Generating QR code for stockId: ${stockId}`);
      if (!mongoose.Types.ObjectId.isValid(stockId)) {
        throw new Error("Invalid stockId format");
      }
      const stock = await Stock.findById(stockId);
      if (!stock) {
        console.log(`Stock not found for stockId: ${stockId}`);
        throw new Error("Stock not found");
      }
      const qrCodeData = stockId.toString();
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);
      stock.qrCode = qrCodeDataURL;
      await stock.save();
      console.log(`QR code generated for stockId: ${stockId}`);
      return qrCodeDataURL;
    } catch (error) {
      console.error(`Error generating QR code: ${error.message}`);
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }

  async getStockByQRCode(stockId) {
    try {
      console.log(`Retrieving stock for stockId: ${stockId}`);
      if (!mongoose.Types.ObjectId.isValid(stockId)) {
        throw new Error("Invalid stockId format");
      }
      const stock = await Stock.findById(stockId)
        .populate("type", "name")
        .populate("restaurant", "name");
      if (!stock) {
        console.log(`Stock not found for stockId: ${stockId}`);
        throw new Error("Stock not found");
      }
      return stock;
    } catch (error) {
      console.error(`Error retrieving stock: ${error.message}`);
      throw new Error(`Failed to retrieve stock: ${error.message}`);
    }
  }

  async addStockToInvoice(invoiceId, stockId, quantity) {
    try {
      console.log(
        `Adding stock to invoice: stockId=${stockId}, invoiceId=${invoiceId}, quantity=${quantity}`
      );
      if (
        !mongoose.Types.ObjectId.isValid(stockId) ||
        !mongoose.Types.ObjectId.isValid(invoiceId)
      ) {
        throw new Error("Invalid stockId or invoiceId format");
      }
      const stock = await Stock.findById(stockId);
      if (!stock) {
        console.log(`Stock not found for stockId: ${stockId}`);
        throw new Error("Stock not found");
      }
      const InvoiceItem = require("@models/invoiceItem");
      const invoiceItem = await InvoiceItem.create({
        invoice: invoiceId,
        stock: stockId,
        quantity,
      });
      stock.quantity += quantity;
      await stock.save();
      console.log(`Stock added to invoice: invoiceItemId=${invoiceItem._id}`);
      return invoiceItem;
    } catch (error) {
      console.error(`Error adding stock to invoice: ${error.message}`);
      throw new Error(`Failed to add stock to invoice: ${error.message}`);
    }
  }
}

module.exports = new StockQRCodeService();
