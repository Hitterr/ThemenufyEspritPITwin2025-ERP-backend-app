const { predictIngredientNeeds } = require("../services/forecastService");

exports.getPredictedIngredients = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 14;
    const data = await predictIngredientNeeds(days);
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Erreur forecast:", error);
    res.status(500).json({ success: false, message: "Erreur interne du serveur" });
  }
};
