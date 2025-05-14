const invoiceService = require("../services/invoiceService");
const { invoiceSchema } = require("../validators/invoiceValidator");

const createInvoice = async (req, res) => {
  try {
    const { userId } = req.user;
    const restaurant = req.user.details.restaurant._id;
    const { supplier, items, status, paidStatus } = req.body;

    await invoiceSchema.validate({
      restaurant,
      supplier,
      items,
      status,
      paidStatus,
    });

    const invoice = await invoiceService.createInvoice({
      userId,
      restaurant,
      supplier,
      items,
      status,
      paidStatus,
    });

    res.status(201).json({
      success: true,
      data: invoice,
      message: "Invoice created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getInvoices = async (req, res) => {
  try {
    const restaurant = req.user.details.restaurant._id;
    req.query.restaurant = restaurant;
    const filters = req.query;
    const invoices = await invoiceService.getInvoices(filters);
    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getInvoice = async (req, res) => {
  try {
    const restaurant = req.user.details.restaurant._id;
    const { invoiceId } = req.params;

    const invoice = await invoiceService.getInvoice(invoiceId);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoice.restaurant._id.toString() !== restaurant.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this invoice",
      });
    }
    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const restaurant = req.user.details.restaurant._id;
    const { invoiceId } = req.params;
    const { status } = req.body;
    const invoice = await invoiceService.updateStatus(
      invoiceId,
      status,
      restaurant
    );
    res.status(200).json({
      success: true,
      data: invoice,
      message: "Invoice status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const updateInvoicePaidStatus = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { paidStatus } = req.body;

    const restaurant = req.user.details.restaurant._id;
    const invoice = await invoiceService.updatePaidStatus(
      invoiceId,
      paidStatus,
      restaurant
    );

    res.status(200).json({
      success: true,
      data: invoice,
      message: "Invoice paid status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteInvoice = async (req, res) => {
  try {
    const restaurant = req.user.details.restaurant._id;
    const { invoiceId } = req.params;
    await invoiceService.deleteInvoice(invoiceId, restaurant);
    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getInvoiceStats = async (req, res) => {
  try {
    const { period = "day", startDate, endDate } = req.query;
    const restaurant = req.user.details.restaurant._id;
    // Appeler le service pour obtenir les statistiques
    const stats = await invoiceService.getInvoiceStats({
      period,
      startDate,
      endDate,
      restaurant,
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  updateInvoicePaidStatus,
  getInvoiceStats,
};
