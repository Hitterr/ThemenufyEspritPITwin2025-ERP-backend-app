const Invoice = require("../../../models/invoice");
const InvoiceItem = require("../../../models/invoiceItem");
const invoiceItemService = require("./invoiceItemService");
const PriceHistory = require("../../../models/PriceHistory");
class InvoiceService {
  async createInvoice({
    userId,
    restaurant,
    supplier,
    items,
    status = "pending",
    paidStatus = "nopaid",
  }) {
    let invoice = new Invoice({
      created_by: userId,
      restaurant,
      supplier,
      status,
      paidStatus,
      invoiceNumber: Date.now().toString(),
      deliveredAt: status === "delivered" ? new Date() : null,
    });
    invoice = await invoice.save();
    // Create invoice items
    const itemPromises = items.map((item) =>
      InvoiceItem.create({
        invoice: invoice._id,
        ...item,
      })
    );
    const priceHistoryPromises = items.map((item) => {
      const priceHistoryData = {
        restaurantId: restaurant,
        supplierId: supplier,
        ingredientId: item.ingredient,
        invoiceId: invoice._id,
        price: item.price,
      };
      return PriceHistory.create(priceHistoryData);
    });
    await Promise.all(itemPromises);
    await Promise.all(priceHistoryPromises);
    items = await invoiceItemService.getItemsByInvoiceId(invoice._id);
    invoice.total = items.reduce((sum, item) => {
      const total = sum + item.price * item.quantity;
      console.log(total);
      return total;
    }, 0);
    invoice = await invoice.save();
    return { ...invoice._doc, items };
  }
  async getInvoices() {
    return Invoice.find()
      .populate("created_by", "firstName lastName email")
      .populate("restaurant")
      .populate("supplier");
  }
  async getInvoice(invoiceId) {
    const invoice = await Invoice.findById(invoiceId)
      .populate("created_by", "firstName lastName email")
      .populate("restaurant")
      .populate("supplier");
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    const items = await InvoiceItem.find({ invoice: invoiceId }).populate(
      "ingredient",
      "libelle price"
    );
    return { ...invoice._doc, items };
  }
  async updateStatus(invoiceId, status) {
    const delivered = status.toLowerCase() == "delivered" ? new Date() : null;
    let invoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { status, deliveredAt: delivered },
      { new: true }
    );
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    return invoice;
  }
  async updatePaidStatus(invoiceId, paidStatus) {
    if (!["paid", "nopaid"].includes(paidStatus)) {
      throw new Error("Invalid paidStatus value. Must be 'paid' or 'nopaid'.");
    }

    let invoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { paidStatus },
      { new: true }
    );

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return invoice;
  }
  async deleteInvoice(invoiceId) {
    const invoice = await Invoice.findByIdAndDelete(invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    //delete price histories of this invoice(invoiceid)
    await PriceHistory.deleteMany({ invoiceId: invoiceId });
    return invoice;
  }

  async getInvoiceStats({ period = "day", startDate, endDate }) {
    const groupByField = this.getGroupByField(period);
    const matchStage =
      startDate && endDate
        ? {
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          }
        : {};
    const stats = await Invoice.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupByField,
          totalInvoices: { $sum: 1 },
          paidInvoices: {
            $sum: { $cond: [{ $eq: ["$paidStatus", "paid"] }, 1, 0] },
          },
          pendingInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          cancelledInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return stats;
  }

  getGroupByField(period) {
    switch (period) {
      case "week":
        return { $isoWeek: "$createdAt" };
      case "month":
        return { $month: "$createdAt" };
      case "year":
        return { $year: "$createdAt" };
      default:
        return { $dayOfYear: "$createdAt" };
    }
  }

  getPeriodFormat(period) {
    switch (period) {
      case "week":
        return "%Y-W%U";
      case "month":
        return "%Y-%m";
      case "year":
        return "%Y";
      default:
        return "%Y-%m-%d";
    }
  }
}
module.exports = new InvoiceService();
