const supplierService = require("../services/supplierService");
const {
  NotFoundError,
  ConflictError,
  ValidationError,
} = require("../../../utils/errors");
const yup = require("yup");

const linkStockSchema = yup.object().shape({
  stockId: yup.string().required("Stock ID is required"),
  pricePerUnit: yup.number().min(0).required("Price per unit is required"),
  leadTimeDays: yup.number().min(1).required("Lead time is required"),
  moq: yup.number().min(1).optional(), // Optional, calculated dynamically if not provided
  qualityScore: yup.number().min(0).max(100).optional(), // Optional, calculated dynamically
});

const bulkStockSchema = yup.array().of(
  yup.object().shape({
    stockId: yup.string().required("Stock ID is required"),
    pricePerUnit: yup.number().min(0).optional(),
    leadTimeDays: yup.number().min(1).optional(),
    moq: yup.number().min(1).optional(),
    qualityScore: yup.number().min(0).max(100).optional(),
  })
);

// Create a new supplier
const createSupplier = async (req, res) => {
  try {
    console.log("Creating supplier with data:", req.body);
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    console.error("Error in createSupplier:", error.message);
    const statusCode =
      error instanceof ConflictError
        ? 409
        : error instanceof ValidationError
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  }
};

// Get all suppliers with pagination and filtering
const getAllSuppliers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, restaurantId } = req.query;
    const result = await supplierService.getAllSuppliers({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      status,
      restaurantId,
    });

    res.status(200).json({
      success: true,
      data: result.suppliers,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error in getAllSuppliers:", error.message);
    const statusCode = error instanceof ValidationError ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a supplier by ID with populated data
const getSupplierById = async (req, res) => {
  try {
    const supplier = await supplierService.getSupplierById(
      req.params.supplierId
    );
    res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    console.error("Error in getSupplierById:", error.message);
    const statusCode =
      error instanceof NotFoundError
        ? 404
        : error instanceof ValidationError
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a supplier
const updateSupplier = async (req, res) => {
  try {
    console.log(
      "Updating supplier with ID:",
      req.params.supplierId,
      "Data:",
      req.body
    );
    const supplier = await supplierService.updateSupplier(
      req.params.supplierId,
      req.body
    );
    res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    console.error("Error in updateSupplier:", error.message);
    const statusCode =
      error instanceof NotFoundError
        ? 404
        : error instanceof ConflictError
        ? 409
        : error instanceof ValidationError
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a supplier
const deleteSupplier = async (req, res) => {
  try {
    const result = await supplierService.deleteSupplier(req.params.supplierId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in deleteSupplier:", error.message);
    const statusCode =
      error instanceof NotFoundError
        ? 404
        : error instanceof ValidationError
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Link a supplier to an stock
const linkStock = async (req, res) => {
  try {
    await linkStockSchema.validate(req.body, { abortEarly: false });
    const { stockId, pricePerUnit, leadTimeDays, moq, qualityScore } = req.body;
    const result = await supplierService.linkStock(
      req.params.supplierId,
      stockId,
      pricePerUnit,
      leadTimeDays,
      moq,
      qualityScore
    );
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in linkStock:", error.message);
    const statusCode =
      error instanceof NotFoundError
        ? 404
        : error instanceof ConflictError
        ? 409
        : error instanceof ValidationError
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Get stocks linked to a supplier
const getSupplierStocks = async (req, res) => {
  try {
    const supplierStocks = await supplierService.getSupplierStocks(
      req.params.supplierId
    );
    res.status(200).json({
      success: true,
      data: supplierStocks,
    });
  } catch (error) {
    console.error("Error in getSupplierStocks:", error.message);
    const statusCode =
      error instanceof NotFoundError
        ? 404
        : error instanceof ValidationError
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Unlink an stock from a supplier
const unlinkStock = async (req, res) => {
  try {
    const { supplierId, stockId } = req.params;
    const result = await supplierService.unlinkStock(supplierId, stockId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in unlinkStock:", error.message);
    const statusCode =
      error instanceof NotFoundError
        ? 404
        : error instanceof ValidationError
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Bulk update supplier stocks
const bulkUpdateSupplierStocks = async (req, res) => {
  try {
    await bulkStockSchema.validate(req.body.stocks, { abortEarly: false });
    const { supplierId } = req.params;
    const { stocks } = req.body;
    const result = await supplierService.bulkUpdateSupplierStocks(
      supplierId,
      stocks
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in bulkUpdateSupplierStocks:", error.message);
    const statusCode =
      error instanceof NotFoundError
        ? 404
        : error instanceof ValidationError
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Get top suppliers by delivery time
const getTopSuppliersByDeliveryTime = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate query parameters are required",
      });
    }

    const stats = await supplierService.getTopSuppliersByDeliveryTime({
      startDate,
      endDate,
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error in getTopSuppliersByDeliveryTime:", error.message);
    const statusCode = error instanceof ValidationError ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Get supplier statistics
const getSupplierStats = async (req, res) => {
  try {
    const stats = await supplierService.getSupplierStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error in getSupplierStats:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  linkStock,
  getSupplierStocks,
  unlinkStock,
  bulkUpdateSupplierStocks,
  getTopSuppliersByDeliveryTime,
  getSupplierStats,
};