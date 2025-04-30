const stockService = require("../services/stockService");
const yup = require("yup");

const stockSchema = yup.object().shape({
    libelle: yup.string().required(),
    quantity: yup.number().min(0).required(),
    type: yup.string().required(),
    price: yup.number().min(0).required(),
    disponibility: yup.boolean(),
    maxQty: yup.number().min(0).required(),
    minQty: yup.number().min(0).required(),
    unit: yup.string().oneOf(["g", "kg", "mg", "l", "ml", "cl", "pcs"]).required()
});

class StockController {
    async createStock(req, res) {
        try {
            await stockSchema.validate(req.body, { abortEarly: false });
            const result = await stockService.createStock(req.body);
            return res.status(201).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error(error);
            if (error instanceof yup.ValidationError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.errors,
                });
            }
            return res.status(500).json({
                success: false,
                message: error.message || "Error creating stock item",
            });
        }
    }

    async getAllStocks(req, res) {
        try {
            const filters = req.query || {};
            const { limit, page } = req.query;
            const data = await stockService.getAllStocks(page, limit, filters);
            return res.status(200).json({
                success: true,
                data: data.stocks,
                pagination: {
                    currentPage: data.currentPage,
                    totalPages: data.totalPages,
                    totalItems: data.totalItems,
                    limit: data.limit,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error fetching stock items",
            });
        }
    }

    async getStockById(req, res) {
        try {
            const stock = await stockService.getStockById(req.params.id);
            if (!stock) {
                return res.status(404).json({
                    success: false,
                    message: "Stock item not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: stock,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error fetching stock item",
            });
        }
    }

    async updateStock(req, res) {
        try {
            await stockSchema.validate(req.body, { abortEarly: false });
            const updatedStock = await stockService.updateStock(
                req.params.id,
                req.body
            );
            if (!updatedStock) {
                return res.status(404).json({
                    success: false,
                    message: "Stock item not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: updatedStock,
            });
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.errors,
                });
            }
            return res.status(500).json({
                success: false,
                message: error.message || "Error updating stock item",
            });
        }
    }

    async deleteStock(req, res) {
        try {
            const result = await stockService.deleteStock(req.params.id);
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: "Stock item not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Stock item deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error deleting stock item",
            });
        }
    }

    async increaseQuantity(req, res) {
        try {
            const { amount } = req.body;
            if (!amount || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Valid amount is required",
                });
            }
            const stock = await stockService.increaseQuantity(
                req.params.id,
                amount
            );
            return res.status(200).json({
                success: true,
                data: stock,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error updating stock quantity",
            });
        }
    }

    async decreaseQuantity(req, res) {
        try {
            const { amount } = req.body;
            if (!amount || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Valid amount is required",
                });
            }
            const stock = await stockService.decreaseQuantity(
                req.params.id,
                amount
            );
            return res.status(200).json({
                success: true,
                data: stock,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error updating stock quantity",
            });
        }
    }
}

module.exports = new StockController();