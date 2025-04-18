const InvoiceItem = require("../../../models/invoiceItem");
const Invoice = require("../../../models/invoice");

class InvoiceItemService {
  async addItem(invoiceId, itemData) {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const item = await InvoiceItem.create({
      invoice: invoiceId,
      ...itemData,
    });

    await invoice.save(); // This will trigger total recalculation

    return item.populate("ingredient", "libelle price");
  }

  async updateItem(itemId, updateData) {
    const item = await InvoiceItem.findByIdAndUpdate(itemId, updateData, {
      new: true,
    }).populate("ingredient", "libelle price");

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
}

module.exports = new InvoiceItemService();
