    const ConsumptionHistory = require("../../../models/ConsumptionHistory");
    const mongoose = require('mongoose');

    exports.createConsumption = async (ingredientId, restaurantId, qty) => {
      const cleanId = (id, name) => {
        const trimmed = id.toString().trim();
        if (!mongoose.Types.ObjectId.isValid(trimmed)) {
          throw new Error(`${name} invalide : "${id}"`);
        }
        return trimmed;
      };

      const iid = cleanId(ingredientId,  "ingredientId");
      const rid = cleanId(restaurantId, "restaurantId");

      const newConsumption = new ConsumptionHistory({
        ingredientId: iid,
        restaurantId:  rid,
        qty
      });

      try {
        return await newConsumption.save();
      } catch (err) {
        console.error("Erreur lors de la création de la consommation:", err);
        throw err;
      }
    };



    exports.getConsumptions = async (restaurantId, ingredientId) => {
      const query = {};

      // Fonction utilitaire pour nettoyer et valider un ID
      const cleanId = (id, name) => {
        if (!id) return null;
        const trimmed = id.toString().trim();            
        if (!mongoose.Types.ObjectId.isValid(trimmed)) {
          throw new Error(`${name} invalide : "${id}"`);
        }
        return trimmed;
      };

      // Nettoyage / validation
      const rid = cleanId(restaurantId, "restaurantId");
      const iid = cleanId(ingredientId,  "ingredientId");

      if (rid) query.restaurantId  = rid;
      if (iid) query.ingredientId  = iid;

      try {
        return await ConsumptionHistory
          .find(query)
          .populate("ingredientId")
          .populate("restaurantId");
      } catch (err) {
        console.error("Erreur lors de la récupération des consommations:", err);
        throw err;
      }
    };

    exports.getDailyTrends = async (restaurantId, days = 30) => {
      try {
        // Convertir l'ID et valider
        const rid = new mongoose.Types.ObjectId(restaurantId); // Conversion explicite
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
    
        // Agrégation avec timezone UTC
        return await ConsumptionHistory.aggregate([
          {
            $match: {
              restaurantId: rid, // Utiliser l'ObjectId converti
              createdAt: { $gte: startDate }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                  timezone: "UTC" // Forcer UTC pour éviter les décalages
                }
              },
              totalQty: { $sum: "$qty" },
              count: { $sum: 1 }
            }
          },
          { $sort: { "_id": 1 } }
        ]);
      } catch (err) {
        console.error("Erreur dans getDailyTrends:", err);
        throw err;
      }
    };