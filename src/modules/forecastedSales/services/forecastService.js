const ConsumptionHistory = require("../../../models/ConsumptionHistory");
const Stock = require("../../../models/stock");

exports.predictStockNeeds = async (days = 14) => {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  // Agrégation par ingrédient
  const aggregated = await ConsumptionHistory.aggregate([
    { $match: { createdAt: { $gte: sinceDate } } },
    {
      $group: {
        _id: "$stockId",
        totalQty: { $sum: "$qty" },
        daysCount: { $addToSet: { $dayOfYear: "$createdAt" } },
      },
    },
  ]);

  const results = [];

  for (const entry of aggregated) {
    const stock = await Stock.findById(entry._id);
    if (!stock) continue;

    const avgPerDay = entry.totalQty / entry.daysCount.length;
    const forecastedQty = Number((avgPerDay * days).toFixed(2));
    const currentStock = stock.quantity;
    const missingQty = Math.max(0, forecastedQty - currentStock);

    results.push({
      stock: stock.libelle,
      unit: stock.unit,
      avgPerDay: Number(avgPerDay.toFixed(2)),
      forecastedQty,
      currentStock,
      missingQty,
    });
  }

  return results;
};
