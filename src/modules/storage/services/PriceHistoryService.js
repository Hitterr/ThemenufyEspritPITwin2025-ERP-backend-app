const PriceHistory = require("../../../models/PriceHistory");
const mongoose = require('mongoose');

exports.createPriceHistory = async ({ ingredientId, restaurantId, invoiceId, price, supplierId }) => {
  const cleanId = (id, name, required = true) => {
    if (!id && required) throw new Error(`${name} est requis`);
    if (!id) return null;
    
    const trimmed = id.toString().trim();
    if (!mongoose.Types.ObjectId.isValid(trimmed)) {
      throw new Error(`${name} invalide : "${id}"`);
    }
    return trimmed;
  };

  try {
    // Validation des IDs
    const validatedData = {
      ingredientId: cleanId(ingredientId, "ingredientId"),
      restaurantId: cleanId(restaurantId, "restaurantId"),
      invoiceId: cleanId(invoiceId, "invoiceId"),
      price: Number(price),
      ...(supplierId && { supplierId: cleanId(supplierId, "supplierId", false) })
    };

    // Validation du prix
    if (isNaN(validatedData.price) || validatedData.price <= 0) {
      throw new Error(`Prix invalide: ${price}`);
    }

    // Création et sauvegarde
    const newPriceHistory = new PriceHistory(validatedData);
    return await newPriceHistory.save();

  } catch (err) {
    console.error("Erreur création PriceHistory:", {
      input: { ingredientId, restaurantId, invoiceId, price, supplierId },
      error: err.message
    });
    throw err;
  }
};

exports.getPriceHistories = async ({ restaurantId, ingredientId, supplierId, invoiceId }) => {
  const buildQuery = (id, fieldName) => {
    if (!id) return null;
    const cleaned = id.toString().trim();
    if (!mongoose.Types.ObjectId.isValid(cleaned)) {
      throw new Error(`${fieldName} invalide : "${id}"`);
    }
    return cleaned;
  };

  try {
    const query = {
      ...(restaurantId && { restaurantId: buildQuery(restaurantId, "restaurantId") }),
      ...(ingredientId && { ingredientId: buildQuery(ingredientId, "ingredientId") }),
      ...(supplierId && { supplierId: buildQuery(supplierId, "supplierId") }),
      ...(invoiceId && { invoiceId: buildQuery(invoiceId, "invoiceId") })
    };

    // Vérification qu'au moins un filtre est présent
    if (Object.keys(query).length === 0) {
      throw new Error("Au moins un paramètre de filtrage doit être fourni");
    }

    return await PriceHistory.find(query)
      .populate("ingredientId")
      .populate("restaurantId")
      .populate("supplierId")
      .populate("invoiceId")
      .sort({ createdAt: -1 });
  } catch (err) {
    console.error("Erreur getPriceHistories:", { 
      params: { restaurantId, ingredientId, supplierId, invoiceId },
      error: err.message 
    });
    throw err;
  }
};

exports.getDailyPriceTrends = async ({ ingredientId, restaurantId, days = 30 }) => {
  try {
    // Validation des IDs
    if (!mongoose.Types.ObjectId.isValid(ingredientId) || 
        !mongoose.Types.ObjectId.isValid(restaurantId)) {
      throw new Error("IDs ingrédient ou restaurant invalides");
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const results = await PriceHistory.aggregate([
      {
        $match: {
          ingredientId: new mongoose.Types.ObjectId(ingredientId),
          restaurantId: new mongoose.Types.ObjectId(restaurantId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      {
        $project: {
          date: "$_id",
          avgPrice: { $round: ["$avgPrice", 2] },
          minPrice: 1,
          maxPrice: 1,
          count: 1,
          _id: 0
        }
      }
    ]);

    return results;
  } catch (err) {
    console.error("Erreur getDailyPriceTrends:", {
      params: { ingredientId, restaurantId, days },
      error: err.message
    });
    throw err;
  }
};