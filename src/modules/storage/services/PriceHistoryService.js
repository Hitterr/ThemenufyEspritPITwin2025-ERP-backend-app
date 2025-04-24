const PriceHistory = require("../../../models/PriceHistory");
const Supplier = require('../../../models/Supplier');
const mongoose = require('mongoose');

exports.createPriceHistory = async (ingredientId, restaurantId, price, supplierId) => {
  const cleanId = (id, name) => {
    const trimmed = id.toString().trim();
    if (!mongoose.Types.ObjectId.isValid(trimmed)) {
      throw new Error(`${name} invalide : "${id}"`);
    }
    return trimmed;
  };

  const iid = cleanId(ingredientId, "ingredientId");
  const rid = cleanId(restaurantId, "restaurantId");
  const sid = supplierId ? cleanId(supplierId, "supplierId") : null;

  const newPriceHistory = new PriceHistory({
    ingredientId: iid,
    restaurantId: rid,
    price,
    ...(sid && { supplierId: sid }) // Ajoute supplierId seulement si fourni
  });

  try {
    return await newPriceHistory.save();
  } catch (err) {
    console.error("Erreur lors de la création de l'historique de prix:", err);
    throw err;
  }
};

exports.getPriceHistories = async (restaurantId, ingredientId, supplierId) => {
  const query = {};

  const cleanId = (id, name) => {
    if (!id) return null;
    const trimmed = id.toString().trim();            
    if (!mongoose.Types.ObjectId.isValid(trimmed)) {
      throw new Error(`${name} invalide : "${id}"`);
    }
    return trimmed;
  };

  const rid = cleanId(restaurantId, "restaurantId");
  const iid = cleanId(ingredientId, "ingredientId");
  const sid = cleanId(supplierId, "supplierId");

  if (rid) query.restaurantId = rid;
  if (iid) query.ingredientId = iid;
  if (sid) query.supplierId = sid;

  try {
    return await PriceHistory
      .find(query)
      .populate("ingredientId")
      .populate("restaurantId")
      .populate("supplierId")
      .sort({ createdAt: -1 });
  } catch (err) {
    console.error("Erreur lors de la récupération des historiques de prix:", err);
    throw err;
  }
};

exports.getDailyPriceTrends = async (ingredientId, restaurantId, days = 30) => {
  try {
    const iid = new mongoose.Types.ObjectId(ingredientId);
    const rid = new mongoose.Types.ObjectId(restaurantId);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await PriceHistory.aggregate([
      {
        $match: {
          ingredientId: iid,
          restaurantId: rid,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "UTC"
            }
          },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
  } catch (err) {
    console.error("Erreur dans getDailyPriceTrends:", err);
    throw err;
  }
};

