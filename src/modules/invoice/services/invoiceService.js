const Invoice = require("../../../models/invoice");
const InvoiceItem = require("../../../models/invoiceItem");

class InvoiceService {
  async createInvoice({ userId, restaurant, supplier, items }) {
    const invoice = new Invoice({
      user: userId,
      restaurant,
      supplier,
      invoiceNumber: Date.now().toString(), // You might want a better number generation logic
    });

    await invoice.save();

    // Create invoice items
    const itemPromises = items.map((item) =>
      InvoiceItem.create({
        invoice: invoice._id,
        ...item,
      })
    );

    await Promise.all(itemPromises);

    return this.getInvoice(invoice._id);
  }

  async getInvoices() {
    return Invoice.find()
      .populate("user", "firstName lastName email")
      .populate("restaurant")
      .populate("supplier");
  }

  async getInvoice(invoiceId) {
    const invoice = await Invoice.findById(invoiceId)
      .populate("user", "firstName lastName email")
      .populate("restaurant")
      .populate("supplier");

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const items = await InvoiceItem.find({ invoice: invoiceId }).populate(
      "ingredient",
      "libelle price"
    );

    return { ...invoice.toObject(), items };
  }

  async updateStatus(invoiceId, status) {
    const invoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { status },
      { new: true }
    );

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return invoice;
  }
}

module.exports = new InvoiceService();
