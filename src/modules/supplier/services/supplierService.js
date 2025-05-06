const mongoose = require("mongoose");
const Supplier = require("../../../models/supplier");
const Stock = require("../../../models/stock");
const Invoice = require("../../../models/invoice");
const {
  NotFoundError,
  ConflictError,
  ValidationError,
} = require("../../../utils/errors");

class SupplierService {
  // Create a new supplier with email uniqueness check
  static async createSupplier(supplierData) {
    console.log("SupplierService.createSupplier - Data:", supplierData);
    const existingSupplier = await Supplier.findOne({
      "contact.email": supplierData.contact.email,
    });

    if (existingSupplier) {
      throw new ConflictError("Supplier with this email already exists");
    }

    if (
      supplierData.contract?.endDate &&
      new Date(supplierData.contract.endDate) <
        new Date(supplierData.contract.startDate)
    ) {
      throw new ValidationError("Contract end date must be after start date");
    }

    const supplier = new Supplier(supplierData);
    const savedSupplier = await supplier.save();
    console.log("SupplierService.createSupplier - Saved:", savedSupplier._id);
    return savedSupplier;
  }

  // Get all suppliers with pagination and filtering
  static async getAllSuppliers({ page = 1, limit = 10, status, restaurantId }) {
    try {
      const query = {};
      if (status) query.status = status;
      if (restaurantId) {
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
          throw new ValidationError("Invalid restaurant ID format");
        }
        query.restaurantId = restaurantId;
      }

      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        populate: "restaurantId",
        sort: { createdAt: -1 },
      };

      if (typeof Supplier.paginate !== "function") {
        throw new Error(
          "Pagination plugin not properly initialized on Supplier model"
        );
      }

      const result = await Supplier.paginate(query, options);
      console.log(
        "SupplierService.getAllSuppliers - Result:",
        result.pagination
      );
      return {
        suppliers: result.docs,
        pagination: {
          total: result.totalDocs,
          pages: result.totalPages,
          page: result.page,
          limit: result.limit,
          hasNext: result.hasNextPage,
          hasPrev: result.hasPrevPage,
        },
      };
    } catch (error) {
      console.error("Error in SupplierService.getAllSuppliers:", error.message);
      throw error;
    }
  }

  // Get supplier by ID with detailed information
  static async getSupplierById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid supplier ID format");
    }

    const supplier = await Supplier.findById(id)
      .populate("restaurantId")
      .populate("stocks.stockId");

    if (!supplier) {
      throw new NotFoundError("Supplier not found");
    }
    console.log("SupplierService.getSupplierById - Found:", supplier._id);
    return supplier;
  }

  // Update supplier with validation
  static async updateSupplier(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid supplier ID format");
    }

    if (updateData.contact?.email) {
      const existingSupplier = await Supplier.findOne({
        "contact.email": updateData.contact.email,
        _id: { $ne: id },
      });

      if (existingSupplier) {
        throw new ConflictError("Another supplier already uses this email");
      }
    }

    const supplier = await Supplier.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("stocks.stockId");

    if (!supplier) {
      throw new NotFoundError("Supplier not found");
    }
    console.log("SupplierService.updateSupplier - Updated:", supplier._id);
    return supplier;
  }

  // Delete supplier
  static async deleteSupplier(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid supplier ID format");
    }

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      throw new NotFoundError("Supplier not found");
    }

    await Supplier.deleteOne({ _id: id });
    console.log("SupplierService.deleteSupplier - Deleted:", id);
    return {
      success: true,
      message: "Supplier deleted successfully",
    };
  }

  // Link stock to supplier by adding to stocks array
  static async linkStock(supplierId, stockId, pricePerUnit, leadTimeDays) {
    if (
      !mongoose.Types.ObjectId.isValid(supplierId) ||
      !mongoose.Types.ObjectId.isValid(stockId)
    ) {
      throw new ValidationError("Invalid ID format");
    }

    const [supplier, stock] = await Promise.all([
      Supplier.findById(supplierId),
      Stock.findById(stockId),
    ]);

    if (!supplier) throw new NotFoundError("Supplier not found");
    if (!stock) throw new NotFoundError("Stock not found");

    // Check if stock is already linked
    const existingLink = supplier.stocks.find(
      (ing) => ing.stockId.toString() === stockId
    );

    if (existingLink) {
      throw new ConflictError("Supplier is already linked to this stock");
    }

    // Add new stock to the supplier's stocks array
    supplier.stocks.push({
      stockId,
      pricePerUnit,
      leadTimeDays,
    });

    const updatedSupplier = await supplier.save();
    console.log("SupplierService.linkStock - Linked:", stockId);
    return updatedSupplier;
  }

  // Unlink stock from supplier by removing from stocks array
  static async unlinkStock(supplierId, stockId) {
    try {
      console.log("Unlinking - Supplier ID:", supplierId, "Stock ID:", stockId);
      if (
        !mongoose.Types.ObjectId.isValid(supplierId) ||
        !mongoose.Types.ObjectId.isValid(stockId)
      ) {
        throw new ValidationError("Invalid supplier or stock ID format");
      }

      const supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        throw new NotFoundError("Supplier not found");
      }

      const stockIndex = supplier.stocks.findIndex(
        (ing) => ing.stockId.toString() === stockId
      );

      if (stockIndex === -1) {
        throw new NotFoundError("Stock not linked to this supplier");
      }

      // Remove the stock from the array
      supplier.stocks.splice(stockIndex, 1);
      await supplier.save();

      console.log("Unlinked successfully");
      return true;
    } catch (error) {
      console.error(
        "Error in unlinkStock (Service):",
        error.message,
        error.stack
      );
      throw error;
    }
  }

  // Get all stocks for a supplier with pricing info
  static async getSupplierStocks(supplierId) {
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      throw new ValidationError("Invalid supplier ID format");
    }

    const supplier = await Supplier.findById(supplierId).populate(
      "stocks.stockId",
      "libelle type unit"
    );
    if (!supplier) throw new NotFoundError("Supplier not found");

    console.log(
      "SupplierService.getSupplierStocks - Count:",
      supplier.stocks.length
    );
    return supplier.stocks;
  }

  // Bulk update supplier-stock relationships in stocks array
  static async bulkUpdateSupplierStocks(supplierId, stocks) {
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      throw new ValidationError("Invalid supplier ID format");
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) throw new NotFoundError("Supplier not found");

    for (const stock of stocks) {
      if (!mongoose.Types.ObjectId.isValid(stock.stockId)) {
        throw new ValidationError(`Invalid stock ID: ${stock.stockId}`);
      }

      const existingStock = supplier.stocks.find(
        (ing) => ing.stockId.toString() === stock.stockId
      );

      if (existingStock) {
        // Update existing stock
        existingStock.pricePerUnit = stock.pricePerUnit;
        existingStock.leadTimeDays = stock.leadTimeDays;
      } else {
        // Add new stock
        supplier.stocks.push({
          stockId: stock.stockId,
          pricePerUnit: stock.pricePerUnit,
          leadTimeDays: stock.leadTimeDays,
        });
      }
    }

    const updatedSupplier = await supplier.save();
    console.log(
      "SupplierService.bulkUpdateSupplierStocks - Updated:",
      supplierId
    );
    return {
      matchedCount: stocks.length,
      modifiedCount: supplier.stocks.length,
      upsertedCount: stocks.length - supplier.stocks.length,
    };
  }

  // Get top suppliers by delivery time
  static async getTopSuppliersByDeliveryTime({ startDate, endDate } = {}) {
    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start) || isNaN(end)) {
        throw new ValidationError(
          "Invalid date format for startDate or endDate"
        );
      }
      if (start > end) {
        throw new ValidationError("startDate must be before endDate");
      }
      dateFilter = {
        deliveredAt: { $gte: start, $lte: end },
      };
    }

    const stats = await Invoice.aggregate([
      {
        $match: {
          status: "delivered",
          deliveredAt: { $ne: null },
          createdAt: { $ne: null },
          ...dateFilter,
        },
      },
      {
        $addFields: {
          deliveryTimeMs: {
            $subtract: ["$deliveredAt", "$createdAt"],
          },
        },
      },
      {
        $group: {
          _id: "$supplier",
          averageDeliveryTimeMs: { $avg: "$deliveryTimeMs" },
          invoiceCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplierDetails",
        },
      },
      {
        $unwind: {
          path: "$supplierDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          supplierDetails: { $ne: null },
        },
      },
      {
        $addFields: {
          averageDeliveryTimeDays: {
            $divide: ["$averageDeliveryTimeMs", 1000 * 60 * 60 * 24],
          },
        },
      },
      {
        $sort: {
          averageDeliveryTimeDays: 1,
        },
      },
      {
        $project: {
          supplierId: "$_id",
          supplierName: "$supplierDetails.name",
          averageDeliveryTimeDays: 1,
          invoiceCount: 1,
          _id: 0,
        },
      },
    ]);

    console.log(
      "SupplierService.getTopSuppliersByDeliveryTime - Stats:",
      stats
    );
    return stats;
  }

  // Get supplier statistics
  static async getSupplierStats() {
    try {
      const statusAggregation = await Supplier.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const restaurantsAggregation = await Supplier.aggregate([
        {
          $match: {
            restaurantId: { $ne: null },
          },
        },
        {
          $group: {
            _id: null,
            totalRestaurantsLinked: { $addToSet: "$restaurantId" },
          },
        },
        {
          $project: {
            _id: 0,
            totalRestaurantsLinked: { $size: "$totalRestaurantsLinked" },
          },
        },
      ]);

      const stats = {
        active: 0,
        pending: 0,
        suspended: 0,
        inactive: 0,
        totalRestaurantsLinked: 0,
      };

      statusAggregation.forEach((stat) => {
        if (stat._id === "active") stats.active = stat.count;
        else if (stat._id === "pending") stats.pending = stat.count;
        else if (stat._id === "suspended") stats.suspended = stat.count;
        else if (stat._id === "inactive") stats.inactive = stat.count;
      });

      if (restaurantsAggregation.length > 0) {
        stats.totalRestaurantsLinked =
          restaurantsAggregation[0].totalRestaurantsLinked || 0;
      }

      console.log("SupplierService.getSupplierStats - Stats:", stats);
      return statusAggregation.concat({
        _id: "totalRestaurantsLinked",
        count: stats.totalRestaurantsLinked,
      });
    } catch (error) {
      console.error(
        "Error in SupplierService.getSupplierStats:",
        error.message
      );
      throw error;
    }
  }
  
}

module.exports = SupplierService;
