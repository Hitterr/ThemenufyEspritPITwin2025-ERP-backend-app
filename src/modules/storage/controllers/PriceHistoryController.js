const priceHistoryService = require("../services/PriceHistoryService");

exports.createPriceHistory = async (req, res) => {
  try {
    const { ingredientId, restaurantId, price, invoiceId, supplierId } = req.body;

    // Vérification des entrées requises
    if (!ingredientId || !restaurantId || price === undefined || !invoiceId) {
      return res.status(400).json({ 
        message: "Les paramètres ingredientId, restaurantId, invoiceId et price sont requis." 
      });
    }

    const result = await priceHistoryService.createPriceHistory({
      ingredientId,
      restaurantId,
      invoiceId,
      price,
      supplierId
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("Erreur dans createPriceHistory controller:", err);
    const status = err.message.includes("invalide") ? 400 : 500;
    res.status(status).json({ 
      message: "Erreur lors de la création de l'historique de prix",
      error: err.message 
    });
  }
};

exports.getPriceHistories = async (req, res) => {
  try {
    const { restaurantId, ingredientId, supplierId, invoiceId } = req.query;

    // Au moins un filtre doit être présent
    if (!restaurantId && !ingredientId && !supplierId && !invoiceId) {
      return res.status(400).json({ 
        message: "Au moins un filtre doit être fourni." 
      });
    }

    const results = await priceHistoryService.getPriceHistories({
      restaurantId,
      ingredientId,
      supplierId,
      invoiceId
    });

    res.status(200).json(results);
  } catch (err) {
    console.error("Erreur dans getPriceHistories controller:", err);
    const status = err.message.includes("invalide") ? 400 : 500;
    res.status(status).json({ 
      message: "Erreur lors de la récupération des historiques",
      error: err.message 
    });
  }
};

exports.getDailyPriceTrends = async (req, res) => {
  try {
    const { ingredientId, restaurantId } = req.params;
    const days = parseInt(req.query.days) || 30;

    // Validation des paramètres
    if (!ingredientId || !restaurantId) {
      return res.status(400).json({ 
        message: "ingredientId et restaurantId sont requis dans les paramètres URL" 
      });
    }

    const data = await priceHistoryService.getDailyPriceTrends({
      ingredientId,
      restaurantId,
      days
    });

    res.status(200).json(data);
  } catch (err) {
    console.error("Erreur dans getDailyPriceTrends controller:", err);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des tendances de prix",
      error: err.message 
    });
  }
};