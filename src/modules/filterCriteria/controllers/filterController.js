const filterService = require("../services/filterService");

const filterInvoices = async (req, res) => {
  try {
    const filters = req.query;
    const invoices = await filterService.filterInvoices(filters);
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

module.exports = {
  filterInvoices,
};
