// @modules/supplier/controllers/supplierController.js
const supplierService = require("../services/supplierService");
const {
  NotFoundError,
  ConflictError,
  ValidationError,
} = require("../../../utils/errors");

// Create a new supplier
const createSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
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

    res.json({
      success: true,
      data: result.suppliers,
      pagination: result.pagination,
    });
  } catch (error) {
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
    res.json({
      success: true,
      data: supplier,
    });
  } catch (error) {
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
    const supplier = await supplierService.updateSupplier(
      req.params.supplierId,
      req.body
    );
    res.json({
      success: true,
      data: supplier,
    });
  } catch (error) {
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
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
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

// Link a supplier to an ingredient
const linkIngredient = async (req, res) => {
  try {
    const { ingredientId, pricePerUnit, leadTimeDays } = req.body;
    const result = await supplierService.linkIngredient(
      req.params.supplierId,
      ingredientId,
      pricePerUnit,
      leadTimeDays
    );
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
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

// Get ingredients linked to a supplier
const getSupplierIngredients = async (req, res) => {
  try {
    const supplierIngredients = await supplierService.getSupplierIngredients(
      req.params.supplierId
    );
    res.json({
      success: true,
      data: supplierIngredients,
    });
  } catch (error) {
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

// Get suppliers by ingredient
const getSuppliersByIngredient = async (req, res) => {
  try {
    const suppliers = await supplierService.getSuppliersByIngredient(
      req.params.ingredientId
    );
    res.json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
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

// Get supplier statistics
const getSupplierStats = async (req, res) => {
  try {
    const stats = await supplierService.getSupplierStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Unlink an ingredient from a supplier
const unlinkIngredient = async (req, res) => {
  try {
    const { supplierId, ingredientId } = req.params;
    const result = await supplierService.unlinkIngredient(
      supplierId,
      ingredientId
    );
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
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

// Bulk update supplier ingredients
const bulkUpdateSupplierIngredients = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const { ingredients } = req.body;
    const result = await supplierService.bulkUpdateSupplierIngredients(
      supplierId,
      ingredients
    );
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
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

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  linkIngredient,
  getSupplierIngredients,
  getSuppliersByIngredient,
  getSupplierStats,
  unlinkIngredient,
  bulkUpdateSupplierIngredients,
};
