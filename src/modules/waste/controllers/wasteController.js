const wasteService = require('../services/wasteService');
const mongoose = require('mongoose');

class WasteController {
  async getWasteSummary(req, res) {
    try {
      const restaurantId = req.query.restaurantId?.trim();

      // Vérification de la validité de l'ObjectId
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({ error: 'Invalid restaurantId' });
      }

      const result = await wasteService.calculateWasteSummary(
        restaurantId,
        {
          startDate: req.query.startDate,
          endDate: req.query.endDate,
          category: req.query.category
        }
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getWasteTrends(req, res) {
    try {
      const restaurantId = req.query.restaurantId?.trim();

      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({ error: 'Invalid restaurantId' });
      }

      const result = await wasteService.analyzeDailyTrends(
        restaurantId,
        req.query.days
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new WasteController();
