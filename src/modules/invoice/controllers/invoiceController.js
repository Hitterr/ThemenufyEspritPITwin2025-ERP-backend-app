const invoiceService = require("../services/invoiceService");
const { invoiceSchema } = require("../validators/invoiceValidator");

const createInvoice = async (req, res) => {
  try {
    const { userId } = req.user;
    const { restaurant, supplier, items, status, paidStatus } = req.body;

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
    const invoices = await invoiceService.getInvoices();
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
    const { invoiceId } = req.params;
    const invoice = await invoiceService.getInvoice(invoiceId);
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
    const { invoiceId } = req.params;
    const { status } = req.body;
    const invoice = await invoiceService.updateStatus(invoiceId, status);
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

    const invoice = await invoiceService.updatePaidStatus(
      invoiceId,
      paidStatus
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
    const { invoiceId } = req.params;
    await invoiceService.deleteInvoice(invoiceId);
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

    // Appeler le service pour obtenir les statistiques
    const stats = await invoiceService.getInvoiceStats({
      period,
      startDate,
      endDate,
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
