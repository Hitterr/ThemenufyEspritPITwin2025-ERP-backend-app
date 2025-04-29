const { getTurnoverData } = require('../services/turnoverService');

exports.fetchTurnoverStats = async (req, res) => {
  try {
    const data = await getTurnoverData();
    res.json({ success: true, data });
  } catch (err) {
    console.error('❌ Erreur turnover:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};
exports.getIngredientHistoryChart = async (req, res) => {
    try {
      const { ingredientId } = req.params;
      const data = await getConsumptionHistoryByDay(ingredientId);
      res.json({ success: true, data });
    } catch (err) {
      console.error('❌ Erreur consommation quotidienne :', err);
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  };
