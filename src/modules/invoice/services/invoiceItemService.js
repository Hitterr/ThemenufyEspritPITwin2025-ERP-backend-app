const InvoiceItem = require("../../../models/invoiceItem");
const Invoice = require("../../../models/invoice");
const stockService = require("../../stock/services/stockService");
const PriceHistory = require("../../../models/PriceHistory");
class InvoiceItemService {
  async addItem(invoiceId, itemData) {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    if (itemData.stock) {
      const ing = await stockService.getStockById(itemData.stock);
      if (!ing) {
        throw new Error("Stock not found");
      } else if (ing && itemData.price != ing.price) {
        ing.price = itemData.price;
        await ing.save();
        //add price history (itemData.price , itemData.suppplier , itemData.restaurantid)
        const priceHistoryData = {
          restaurantId: itemData.restaurantId, // Assuming you have restaurantId in itemData
          supplierId: itemData.supplierId, // Assuming supplierId is in itemData
          stockId: itemData.stock,
          invoiceId: invoiceId,
          price: itemData.price,
        };
        await PriceHistory.create(priceHistoryData); // Create new price history
      }
      itemData.price = ing.price;
      itemData.stock = ing._id;
    }
    const item = await InvoiceItem.create({
      invoice: invoiceId,
      ...itemData,
    });
    await invoice.save(); // This will trigger total recalculation
    return item.populate("stock", "libelle price");
  }
  async updateItem(itemId, updateData) {
    if (updateData.stock) {
      const ing = await stockService.getStockById(updateData.stock);
      if (!ing) {
        throw new Error("Stock not found");
      } else if (ing && updateData.price != ing.price) {
        ing.price = updateData.price;
        await ing.save();
      }
      updateData.price = ing.price;
      updateData.stock = ing._id; // Assuming you have a field named 'stock' in your InvoiceItem schem
    }
    const item = await InvoiceItem.findByIdAndUpdate(itemId, updateData, {
      new: true,
    }).populate("stock", "libelle price");
    if (!item) {
      throw new Error("Invoice item not found");
    }
    const invoice = await Invoice.findById(item.invoice);
    await invoice.save(); // Recalculate total
    return item;
  }
  async deleteItem(itemId) {
    const item = await InvoiceItem.findById(itemId);
    if (!item) {
      throw new Error("Invoice item not found");
    }
    const invoice = await Invoice.findById(item.invoice);
    await item.remove();
    await invoice.save(); // Recalculate total
    return true;
  }
  async getItemsByInvoiceId(invoiceId) {
    return await InvoiceItem.find({ invoice: invoiceId });
  }
}
module.exports = new InvoiceItemService();
