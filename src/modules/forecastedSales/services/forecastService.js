const ConsumptionHistory = require("../../../models/ConsumptionHistory");
const Ingredient = require("../../../models/ingredient");

exports.predictIngredientNeeds = async (days = 14) => {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  // Agrégation par ingrédient
  const aggregated = await ConsumptionHistory.aggregate([
    { $match: { createdAt: { $gte: sinceDate } } },
    {
      $group: {
        _id: "$ingredientId",
        totalQty: { $sum: "$qty" },
        daysCount: { $addToSet: { $dayOfYear: "$createdAt" } }
      }
    }
  ]);

  const results = [];

  for (const entry of aggregated) {
    const ingredient = await Ingredient.findById(entry._id);
    if (!ingredient) continue;

    const avgPerDay = entry.totalQty / entry.daysCount.length;
    const forecastedQty = Number((avgPerDay * days).toFixed(2));
    const currentStock = ingredient.quantity;
    const missingQty = Math.max(0, forecastedQty - currentStock);

    results.push({
      ingredient: ingredient.libelle,
      unit: ingredient.unit,
      avgPerDay: Number(avgPerDay.toFixed(2)),
      forecastedQty,
      currentStock,
      missingQty
    });
  }

  return results;
};
