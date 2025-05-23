const priceHistoryService = require("../services/PriceHistoryService");
exports.createPriceHistory = async (req, res) => {
  try {
    const restaurantId = req.user.details.restaurant._id;
    const { stockId, price, invoiceId, supplierId } = req.body;
    // Vérification des entrées requises
    if (!stockId || !restaurantId || price === undefined || !invoiceId) {
      return res.status(400).json({
        message:
          "Les paramètres stockId, restaurantId, invoiceId et price sont requis.",
      });
    }
    const result = await priceHistoryService.createPriceHistory({
      stockId,
      restaurantId,
      invoiceId,
      price,
      supplierId,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error("Erreur dans createPriceHistory controller:", err);
    const status = err.message.includes("invalide") ? 400 : 500;
    res.status(status).json({
      message: "Erreur lors de la création de l'historique de prix",
      error: err.message,
    });
  }
};
exports.getPriceHistories = async (req, res) => {
  try {
    const restaurantId = req.user.details.restaurant._id;
    const { stockId = "", supplierId = "", invoiceId = "" } = req.query;
    // Au moins un filtre doit être présent
    const results = await priceHistoryService.getPriceHistories({
      restaurantId,
      stockId,
      supplierId,
      invoiceId,
    });
    res.status(200).json(results);
  } catch (err) {
    console.error("Erreur dans getPriceHistories controller:", err);
    const status = err.message.includes("invalide") ? 400 : 500;
    res.status(status).json({
      message: "Erreur lors de la récupération des historiques",
      error: err.message,
    });
  }
};
exports.getDailyPriceTrends = async (req, res) => {
  try {
    const restaurantId = req.user.details.restaurant._id;
    const { stockId } = req.params;
    const days = parseInt(req.query.days) || 30;
    // Validation des paramètres
    if (!stockId || !restaurantId) {
      return res.status(400).json({
        message: "stockId et restaurantId sont requis dans les paramètres URL",
      });
    }
    const data = await priceHistoryService.getDailyPriceTrends({
      stockId,
      restaurantId,
      days,
    });
    res.status(200).json(data);
  } catch (err) {
    console.error("Erreur dans getDailyPriceTrends controller:", err);
    res.status(500).json({
      message: "Erreur lors de la récupération des tendances de prix",
      error: err.message,
    });
  }
};
