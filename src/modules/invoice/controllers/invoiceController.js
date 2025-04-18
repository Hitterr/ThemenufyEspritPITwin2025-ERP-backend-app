const invoiceService = require("../services/invoiceService");
const { invoiceSchema } = require("../validators/invoiceValidator");

const createInvoice = async (req, res) => {
  try {
    const { userId } = req.user;
    const { restaurant, supplier, items } = req.body;

    await invoiceSchema.validate({ restaurant, supplier, items });

    const invoice = await invoiceService.createInvoice({
      userId,
      restaurant,
      supplier,
      items,
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

module.exports = {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoiceStatus,
};
