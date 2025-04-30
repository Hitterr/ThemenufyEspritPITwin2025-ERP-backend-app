const PriceHistory = require("../../../models/PriceHistory");
const mongoose = require("mongoose");

exports.createPriceHistory = async ({
  stockId,
  restaurantId,
  invoiceId,
  price,
  supplierId,
}) => {
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
      stockId: cleanId(stockId, "stockId"),
      restaurantId: cleanId(restaurantId, "restaurantId"),
      invoiceId: cleanId(invoiceId, "invoiceId"),
      price: Number(price),
      ...(supplierId && {
        supplierId: cleanId(supplierId, "supplierId", false),
      }),
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
      input: { stockId, restaurantId, invoiceId, price, supplierId },
      error: err.message,
    });
    throw err;
  }
};

exports.getPriceHistories = async ({
  restaurantId,
  stockId,
  supplierId,
  invoiceId,
}) => {
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
      ...(restaurantId && {
        restaurantId: buildQuery(restaurantId, "restaurantId"),
      }),
      ...(stockId && { stockId: buildQuery(stockId, "stockId") }),
      ...(supplierId && { supplierId: buildQuery(supplierId, "supplierId") }),
      ...(invoiceId && { invoiceId: buildQuery(invoiceId, "invoiceId") }),
    };

    // Vérification qu'au moins un filtre est présent
    if (Object.keys(query).length === 0) {
      throw new Error("Au moins un paramètre de filtrage doit être fourni");
    }

    return await PriceHistory.find(query)
      .populate("stockId")
      .populate("restaurantId")
      .populate("supplierId")
      .populate("invoiceId")
      .sort({ createdAt: -1 });
  } catch (err) {
    console.error("Erreur getPriceHistories:", {
      params: { restaurantId, stockId, supplierId, invoiceId },
      error: err.message,
    });
    throw err;
  }
};

exports.getDailyPriceTrends = async ({ stockId, restaurantId, days = 30 }) => {
  try {
    // Validation des IDs
    if (
      !mongoose.Types.ObjectId.isValid(stockId) ||
      !mongoose.Types.ObjectId.isValid(restaurantId)
    ) {
      throw new Error("IDs ingrédient ou restaurant invalides");
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const results = await PriceHistory.aggregate([
      {
        $match: {
          stockId: new mongoose.Types.ObjectId(stockId),
          restaurantId: new mongoose.Types.ObjectId(restaurantId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          avgPrice: { $round: ["$avgPrice", 2] },
          minPrice: 1,
          maxPrice: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    return results;
  } catch (err) {
    console.error("Erreur getDailyPriceTrends:", {
      params: { stockId, restaurantId, days },
      error: err.message,
    });
    throw err;
  }
};
