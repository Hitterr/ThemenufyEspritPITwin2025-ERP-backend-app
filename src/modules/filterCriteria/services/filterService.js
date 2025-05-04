const mongoose = require("mongoose");
const Invoice = require("../../../models/invoice");

class FilterService {
  async filterInvoices(filters) {
    const {
      createdAtFrom,
      createdAtTo,
      deliveredAtFrom,
      deliveredAtTo,
      status,
      paidStatus,
      invoiceNumber,
      created_by,
      restaurant,
      supplier,
      limit = 10, // Valeur par défaut de 10 si aucun "limit" n'est passé
    } = filters;

    const match = {};

    // Gestion des filtres de dates
    if (createdAtFrom || createdAtTo) {
      try {
        match.createdAt = {};
        if (createdAtFrom) {
          match.createdAt.$gte = new Date(createdAtFrom);
        }
        if (createdAtTo) {
          match.createdAt.$lte = new Date(createdAtTo);
        }
      } catch (error) {
        throw new Error("Invalid date format for createdAt filters.");
      }
    }

    if (deliveredAtFrom || deliveredAtTo) {
      try {
        match.deliveredAt = {};
        if (deliveredAtFrom) {
          match.deliveredAt.$gte = new Date(deliveredAtFrom);
        }
        if (deliveredAtTo) {
          match.deliveredAt.$lte = new Date(deliveredAtTo);
        }
      } catch (error) {
        throw new Error("Invalid date format for deliveredAt filters.");
      }
    }

    // Gestion des filtres textuels
    if (status) {
      match.status = status.toLowerCase();
    }

    if (paidStatus) {
      match.paidStatus = paidStatus.toLowerCase();
    }

    if (invoiceNumber) {
      match.invoiceNumber = { $regex: invoiceNumber, $options: "i" };
    }

    // Vérification et conversion des paramètres d'ObjectId
    if (created_by) {
      if (mongoose.Types.ObjectId.isValid(created_by)) {
        match.created_by = mongoose.Types.ObjectId(created_by);
      } else {
        throw new Error("Invalid created_by ObjectId.");
      }
    }

    if (restaurant) {
      if (mongoose.Types.ObjectId.isValid(restaurant)) {
        match.restaurant = mongoose.Types.ObjectId(restaurant);
      } else {
        throw new Error("Invalid restaurant ObjectId.");
      }
    }

    if (supplier) {
      if (mongoose.Types.ObjectId.isValid(supplier)) {
        match.supplier = mongoose.Types.ObjectId(supplier);
      } else {
        throw new Error("Invalid supplier ObjectId.");
      }
    }

    try {
      // Exécution de l'agrégation
      const invoices = await Invoice.aggregate([
        { $match: match },
        {
          $lookup: {
            from: "users",
            localField: "created_by",
            foreignField: "_id",
            as: "created_by",
          },
        },
        { $unwind: { path: "$created_by", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "restaurants",
            localField: "restaurant",
            foreignField: "_id",
            as: "restaurant",
          },
        },
        { $unwind: { path: "$restaurant", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "suppliers",
            localField: "supplier",
            foreignField: "_id",
            as: "supplier",
          },
        },
        { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } },
        { $limit: limit }, // Limiter le nombre de résultats
      ]);

      return invoices;
    } catch (error) {
      throw new Error("Error fetching invoices: " + error.message);
    }
  }
}

module.exports = new FilterService();
