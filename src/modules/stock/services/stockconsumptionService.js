const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Stock = require("../../../models/stock");
const ConsumptionHistory = require("../../../models/ConsumptionHistory");

class stockconsumptionService {
    async getStocksInConsumptionHistory() {
        try {
          const usedStockIds = await ConsumptionHistory.distinct("stockId");
      
          // Convertir chaque id en ObjectId
          const objectIds = usedStockIds.map(id => new ObjectId(id));
      
          const stocks = await Stock.find({ _id: { $in: objectIds } }).populate("type");
          return stocks;
        } catch (err) {
          console.error("getStocksInConsumptionHistory error:", err.message);
          throw err;
        }
      }
      
}

module.exports = new stockconsumptionService();
