const mongoose = require('mongoose');
const ConsumptionHistory = require('../../../models/ConsumptionHistory');
const Ingredient = require('../../../models/ingredient');

class WasteService {
  async calculateWasteSummary(restaurantId, filters = {}) {
    const { startDate, endDate, category } = filters;

    const matchStage = {
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      wastageQty: { $gt: 0 }
    };

    if (startDate && endDate) {
      matchStage.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    return await ConsumptionHistory.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'ingredients',
          localField: 'ingredientId',
          foreignField: '_id',
          as: 'ingredient'
        }
      },
      { $unwind: '$ingredient' },
      ...(category ? [{ $match: { 'ingredient.category': category } }] : []),
      {
        $group: {
          _id: '$ingredientId',
          libelle: { $first: '$ingredient.libelle' },
          unit: { $first: '$ingredient.unit' },
          price: { $first: '$ingredient.price' },
          totalWaste: { $sum: '$wastageQty' },
          occurrences: { $sum: 1 }
        }
      },
      {
        $addFields: {
          totalCost: { $multiply: ['$totalWaste', '$price'] }
        }
      },
      { $sort: { totalCost: -1 } }
    ]);
  }

  async analyzeDailyTrends(restaurantId, days = 7) {
    const matchStage = {
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      wastageQty: { $gt: 0 }
    };
  
    // On prend les X derniers jours
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
  
    matchStage.createdAt = { $gte: startDate };
  
    const trends = await ConsumptionHistory.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'ingredients',
          localField: 'ingredientId',
          foreignField: '_id',
          as: 'ingredient'
        }
      },
      { $unwind: '$ingredient' },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalWaste: { $sum: "$wastageQty" },
          count: { $sum: 1 },
          totalCost: {
            $sum: {
              $multiply: [
                '$wastageQty',
                { $ifNull: ['$ingredient.price', 0] }
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  
    return trends;
  }
}

module.exports = new WasteService();
