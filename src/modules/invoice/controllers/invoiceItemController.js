const invoiceItemService = require("../services/invoiceItemService");
const { invoiceItemSchema } = require("../validators/invoiceItemValidator");
const addInvoiceItem = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { ingredientId, quantity, description } = req.body;

    const item = await invoiceItemService.addItem(invoiceId, {
      ingredient: ingredientId,
      quantity,
      description,
    });

    res.status(201).json({
      success: true,
      data: item,
      message: "Invoice item added successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateInvoiceItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, description } = req.body;

    const item = await invoiceItemService.updateItem(itemId, {
      quantity,
      description,
    });

    res.status(200).json({
      success: true,
      data: item,
      message: "Invoice item updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteInvoiceItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    await invoiceItemService.deleteItem(itemId);

    res.status(200).json({
      success: true,
      message: "Invoice item deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addInvoiceItem,
  updateInvoiceItem,
  deleteInvoiceItem,
};
