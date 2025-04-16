const invoiceService = require("../services/invoiceService");
const {
  invoiceSchema,
  invoiceItemSchema,
} = require("../../invoice/validators/invoiceValidator");

const createInvoice = async (req, res) => {
  try {
    const { userId } = req.user;
    const { items } = req.body;

    await invoiceSchema.validate({ items });

    for (const item of items) {
      await invoiceItemSchema.validate(item);
    }

    const invoice = await invoiceService.createInvoice(userId, items);

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

module.exports = {
  createInvoice,
  getInvoice,
};
