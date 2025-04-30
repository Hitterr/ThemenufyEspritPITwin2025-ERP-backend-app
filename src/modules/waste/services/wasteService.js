const mongoose = require("mongoose");
const ConsumptionHistory = require("../../../models/ConsumptionHistory");
const Stock = require("../../../models/stock");

class WasteService {
  async calculateWasteSummary(restaurantId, filters = {}) {
    const { startDate, endDate, category } = filters;

    const matchStage = {
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      wastageQty: { $gt: 0 },
    };

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    return await ConsumptionHistory.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "stocks",
          localField: "stockId",
          foreignField: "_id",
          as: "stock",
        },
      },
      { $unwind: "$stock" },
      ...(category ? [{ $match: { "stock.category": category } }] : []),
      {
        $group: {
          _id: "$stockId",
          libelle: { $first: "$stock.libelle" },
          unit: { $first: "$stock.unit" },
          price: { $first: "$stock.price" },
          totalWaste: { $sum: "$wastageQty" },
          occurrences: { $sum: 1 },
        },
      },
      {
        $addFields: {
          totalCost: { $multiply: ["$totalWaste", "$price"] },
        },
      },
      { $sort: { totalCost: -1 } },
    ]);
  }
  async calculateWastePercentage(restaurantId, filters = {}) {
    const { startDate, endDate, category } = filters;

    const matchStage = {
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
    };

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Agrégation pour obtenir à la fois l'utilisation et le gaspillage
    const results = await ConsumptionHistory.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "stocks",
          localField: "stockId",
          foreignField: "_id",
          as: "stock",
        },
      },
      { $unwind: "$stock" },
      ...(category ? [{ $match: { "stock.category": category } }] : []),
      {
        $group: {
          _id: "$stockId",
          libelle: { $first: "$stock.libelle" },
          unit: { $first: "$stock.unit" },
          price: { $first: "$stock.price" },
          category: { $first: "$stock.category" },
          totalUsage: { $sum: "$qty" },
          totalWaste: { $sum: "$wastageQty" },
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          wastePercentage: {
            $cond: [
              { $eq: ["$totalUsage", 0] },
              0,
              { $multiply: [{ $divide: ["$totalWaste", "$totalUsage"] }, 100] },
            ],
          },
          totalCost: { $multiply: ["$totalWaste", "$price"] },
        },
      },
      { $sort: { wastePercentage: -1 } },
    ]);

    // Calcul des totaux globaux
    const totals = results.reduce(
      (acc, item) => ({
        totalUsage: acc.totalUsage + item.totalUsage,
        totalWaste: acc.totalWaste + item.totalWaste,
        totalCost: acc.totalCost + item.totalCost,
      }),
      { totalUsage: 0, totalWaste: 0, totalCost: 0 }
    );

    const globalWastePercentage =
      totals.totalUsage > 0 ? (totals.totalWaste / totals.totalUsage) * 100 : 0;

    return {
      items: results,
      summary: {
        ...totals,
        globalWastePercentage,
        itemCount: results.length,
      },
    };
  }

  async analyzeDailyTrends(restaurantId, days = 7) {
    const matchStage = {
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      wastageQty: { $gt: 0 },
    };

    // On prend les X derniers jours
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    matchStage.createdAt = { $gte: startDate };

    const trends = await ConsumptionHistory.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "stocks",
          localField: "stockId",
          foreignField: "_id",
          as: "stock",
        },
      },
      { $unwind: "$stock" },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalWaste: { $sum: "$wastageQty" },
          count: { $sum: 1 },
          totalCost: {
            $sum: {
              $multiply: ["$wastageQty", { $ifNull: ["$stock.price", 0] }],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return trends;
  }
}

module.exports = new WasteService();
