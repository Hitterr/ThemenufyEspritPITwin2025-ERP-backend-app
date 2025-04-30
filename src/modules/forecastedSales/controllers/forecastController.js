const { predictStockNeeds } = require("../services/forecastService");

exports.getPredictedStocks = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 14;
    const data = await predictStockNeeds(days);
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Erreur forecast:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur interne du serveur" });
  }
};
