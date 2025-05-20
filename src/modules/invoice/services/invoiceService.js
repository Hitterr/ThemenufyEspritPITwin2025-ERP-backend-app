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
        stockId: item.stock,
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
  async getInvoices(query) {
    return Invoice.find(query)
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
      "stock",
      "libelle price"
    );
    return { ...invoice._doc, items };
  }
  async updateStatus(invoiceId, status, restaurant) {
    const delivered = status.toLowerCase() == "delivered" ? new Date() : null;
    let invoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId, restaurant },
      { status, deliveredAt: delivered },
      { new: true }
    );
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    return invoice;
  }
  async updatePaidStatus(invoiceId, paidStatus, restaurant) {
    if (!["paid", "nopaid"].includes(paidStatus)) {
      throw new Error("Invalid paidStatus value. Must be 'paid' or 'nopaid'.");
    }

    let invoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId, restaurant },
      { paidStatus },
      { new: true }
    );

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return invoice;
  }
  async deleteInvoice(invoiceId, restaurant) {
    const invoice = await Invoice.findOneAndDelete({
      _id: invoiceId,
      restaurant,
    });
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    //delete price histories of this invoice(invoiceid)
    await PriceHistory.deleteMany({ invoiceId: invoiceId });
    return invoice;
  }

  async getInvoiceStats({ period = "day", startDate, endDate, restaurant }) {
    const groupByField = this.getGroupByField(period);
    const matchStage =
      startDate && endDate
        ? {
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
            restaurant,
          }
        : { restaurant };

    // Aggregate data for both charts
    const stats = await Invoice.aggregate([
      { $match: matchStage },
      {
        $facet: {
          // Radial Bar Chart Data (total counts by status)
          statusCounts: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          // Line Chart Data (counts by period, status, and paidStatus)
          periodCounts: [
            {
              $group: {
                _id: {
                  period: groupByField,
                  status: "$status",
                  paidStatus: "$paidStatus",
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { "_id.period": 1 } },
          ],
        },
      },
    ]);

    // Transform radial bar chart data
    const statusCounts = {};
    stats[0].statusCounts.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    // Transform line chart data
    const periodCounts = {};
    stats[0].periodCounts.forEach((item) => {
      const { period, status, paidStatus } = item._id;
      if (!periodCounts[period]) {
        periodCounts[period] = {};
      }
      if (!periodCounts[period][status]) {
        periodCounts[period][status] = { paid: 0, nopaid: 0 };
      }
      periodCounts[period][status][paidStatus] = item.count;
    });

    return {
      success: true,
      data: {
        statusCounts: {
          pending: statusCounts.pending || 0,
          delivered: statusCounts.delivered || 0,
          cancelled: statusCounts.cancelled || 0,
        },
        periodCounts: Object.keys(periodCounts).map((period) => ({
          period,
          ...periodCounts[period],
        })),
      },
    };
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
        return { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
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
