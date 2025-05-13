const stockService = require("../services/stockconsumptionService");

class stockconsumptionController {

	async getStocksInConsumptionHistory(req, res) {
		try {
			const stocks = await stockService.getStocksInConsumptionHistory();
			return res.status(200).json({
				success: true,
				data: stocks,
			});
		} catch (error) {
			console.error("Error in getStocksInConsumptionHistory:", error);
			return res.status(500).json({
				success: false,
				message: error.message || "Failed to fetch stocks in consumption history",
			});
		}
	}
	
	
}
module.exports = new stockconsumptionController();
