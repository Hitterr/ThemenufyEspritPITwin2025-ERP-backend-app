const Ingredient = require('../../../models/ingredient');
const ConsumptionHistory = require('../../../models/ConsumptionHistory');

exports.getTurnoverData = async () => {
  const date30dAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const ingredients = await Ingredient.find();
  const turnoverData = [];

  for (const ingredient of ingredients) {
    const consumption = await ConsumptionHistory.aggregate([
      {
        $match: {
          ingredientId: ingredient._id,
          createdAt: { $gte: date30dAgo },
        },
      },
      {
        $group: {
          _id: null,
          totalConsumed: { $sum: '$qty' },
        },
      },
    ]);

    const consumedQty = consumption[0]?.totalConsumed || 0;
    const openingQty = ingredient.quantity + consumedQty;
    const turnoverRate = openingQty > 0 ? consumedQty / openingQty : 0;
    const holdingCostPerDay = (ingredient.price * ingredient.quantity) / 30;

    turnoverData.push({
      _id: ingredient._id,
      name: ingredient.libelle,
      quantity: ingredient.quantity,
      minQty: ingredient.minQty,
      maxQty: ingredient.maxQty,
      price: ingredient.price,
      reorderThreshold: ingredient.reorderThreshold,
      turnoverRate: turnoverRate.toFixed(2),
      holdingCostPerDay: holdingCostPerDay.toFixed(2),
    });
  }

  return turnoverData;
};

exports.getConsumptionHistoryByDay = async (ingredientId) => {
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
    const history = await ConsumptionHistory.aggregate([
      {
        $match: {
          ingredientId: new mongoose.Types.ObjectId(ingredientId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          totalQty: { $sum: '$qty' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  
    return history;
  };
