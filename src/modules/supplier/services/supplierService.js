const mongoose = require("mongoose");
const Supplier = require("../../../models/supplier");
const Ingredient = require("../../../models/ingredient");
const SupplierIngredient = require("../../../models/supplierIngredient");
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
      console.log("SupplierService.getAllSuppliers - Result:", result.pagination);
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

    const supplier = await Supplier.findById(id).populate("restaurantId");

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
    });

    if (!supplier) {
      throw new NotFoundError("Supplier not found");
    }
    console.log("SupplierService.updateSupplier - Updated:", supplier._id);
    return supplier;
  }

  // Delete supplier and related data
  static async deleteSupplier(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid supplier ID format");
    }

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      throw new NotFoundError("Supplier not found");
    }

    // Delete related supplier-ingredient links
    await SupplierIngredient.deleteMany({ supplierId: id });

    // Delete supplier
    await Supplier.deleteOne({ _id: id });

    console.log("SupplierService.deleteSupplier - Deleted:", id);
    return {
      success: true,
      message: "Supplier and all related data deleted successfully",
    };
  }

  // Link ingredient to supplier with enhanced checks
  static async linkIngredient(supplierId, ingredientId, pricePerUnit, leadTimeDays) {
    if (
      !mongoose.Types.ObjectId.isValid(supplierId) ||
      !mongoose.Types.ObjectId.isValid(ingredientId)
    ) {
      throw new ValidationError("Invalid ID format");
    }

    const [supplier, ingredient] = await Promise.all([
      Supplier.findById(supplierId),
      Ingredient.findById(ingredientId),
    ]);

    if (!supplier) throw new NotFoundError("Supplier not found");
    if (!ingredient) throw new NotFoundError("Ingredient not found");

    const existingLink = await SupplierIngredient.findOne({
      supplierId,
      ingredientId,
    });

    if (existingLink) {
      throw new ConflictError("Supplier is already linked to this ingredient");
    }

    const supplierIngredient = new SupplierIngredient({
      supplierId,
      ingredientId,
      pricePerUnit,
      leadTimeDays,
    });

    const savedLink = await supplierIngredient.save();
    console.log("SupplierService.linkIngredient - Linked:", savedLink._id);
    return savedLink;
  }

  // Unlink ingredient from supplier
  static async unlinkIngredient(supplierId, ingredientId) {
    try {
      console.log("Unlinking - Supplier ID:", supplierId, "Ingredient ID:", ingredientId);
      if (!mongoose.Types.ObjectId.isValid(supplierId) || !mongoose.Types.ObjectId.isValid(ingredientId)) {
        throw new ValidationError("Invalid supplier or ingredient ID format");
      }

      const supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        throw new NotFoundError("Supplier not found");
      }

      const supplierIngredient = await SupplierIngredient.findOneAndDelete({
        supplierId,
        ingredientId,
      });

      if (!supplierIngredient) {
        throw new NotFoundError("Ingredient not linked to this supplier");
      }

      console.log("Unlinked successfully");
      return true;
    } catch (error) {
      console.error("Error in unlinkIngredient (Service):", error.message, error.stack);
      throw error;
    }
  }

  // Get all ingredients for a supplier with pricing info
  static async getSupplierIngredients(supplierId) {
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      throw new ValidationError("Invalid supplier ID format");
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) throw new NotFoundError("Supplier not found");

    const ingredients = await SupplierIngredient.find({ supplierId })
      .populate({
        path: "ingredientId",
        select: "libelle type unit",
      })
      .lean();
    console.log("SupplierService.getSupplierIngredients - Count:", ingredients.length);
    return ingredients;
  }

  // Bulk update supplier-ingredient relationships
  static async bulkUpdateSupplierIngredients(supplierId, ingredients) {
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      throw new ValidationError("Invalid supplier ID format");
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) throw new NotFoundError("Supplier not found");

    const operations = ingredients.map((ingredient) => {
      if (!mongoose.Types.ObjectId.isValid(ingredient.ingredientId)) {
        throw new ValidationError(
          `Invalid ingredient ID: ${ingredient.ingredientId}`
        );
      }

      return {
        updateOne: {
          filter: {
            supplierId: supplierId,
            ingredientId: ingredient.ingredientId,
          },
          update: {
            $set: {
              pricePerUnit: ingredient.pricePerUnit,
              leadTimeDays: ingredient.leadTimeDays,
            },
          },
          upsert: true,
        },
      };
    });

    const result = await SupplierIngredient.bulkWrite(operations);
    console.log("SupplierService.bulkUpdateSupplierIngredients - Result:", result);
    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    };
  }

  static async getTopSuppliersByDeliveryTime({ startDate, endDate } = {}) {
    // Validate dates if provided
    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start) || isNaN(end)) {
        throw new ValidationError("Invalid date format for startDate or endDate");
      }
      if (start > end) {
        throw new ValidationError("startDate must be before endDate");
      }
      dateFilter = {
        deliveredAt: { $gte: start, $lte: end },
      };
    }

    const stats = await Invoice.aggregate([
      // Step 1: Filter invoices that have been delivered and match the date range
      {
        $match: {
          status: "delivered", // Updated to match Invoice schema
          deliveredAt: { $ne: null },
          createdAt: { $ne: null },
          ...dateFilter, // Apply date filter if provided
        },
      },
      // Step 2: Calculate delivery time for each invoice (in milliseconds)
      {
        $addFields: {
          deliveryTimeMs: {
            $subtract: ["$deliveredAt", "$createdAt"],
          },
        },
      },
      // Step 3: Group by supplier to calculate average delivery time
      {
        $group: {
          _id: "$supplier",
          averageDeliveryTimeMs: { $avg: "$deliveryTimeMs" },
          invoiceCount: { $sum: 1 },
        },
      },
      // Step 4: Lookup supplier details
      {
        $lookup: {
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplierDetails",
        },
      },
      // Step 5: Unwind supplierDetails to get a single supplier object
      {
        $unwind: {
          path: "$supplierDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Step 6: Filter out suppliers that don't exist
      {
        $match: {
          supplierDetails: { $ne: null },
        },
      },
      // Step 7: Convert average delivery time to days
      {
        $addFields: {
          averageDeliveryTimeDays: {
            $divide: ["$averageDeliveryTimeMs", 1000 * 60 * 60 * 24],
          },
        },
      },
      // Step 8: Sort by average delivery time (ascending)
      {
        $sort: {
          averageDeliveryTimeDays: 1,
        },
      },
      // Step 9: Project the fields to return
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

    console.log("SupplierService.getTopSuppliersByDeliveryTime - Stats:", stats);
    console.log("Number of suppliers returned:", stats.length);
    return stats;
  }
}

module.exports = SupplierService;