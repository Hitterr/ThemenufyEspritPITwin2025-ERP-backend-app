const Supplier = require("../../../models/supplier");
const Stock = require("../../../models/stock");
const SupplierService = require("../../supplier/services/supplierService");
const {
	emitStockAlert,
	emitStockUpdate,
} = require("../sockets/socketStockService");
const ConsumptionHistory = require("../../../models/ConsumptionHistory");
class StockService {
	async createStock(stockData) {
		let stock = new Stock(stockData);
		stock = await stock.save();
		return this.getStockById(stock._doc._id);
	}
	buildFiltersQuery(filters) {
		const query = {};
		if (filters?.search) {
			query.libelle = { $regex: filters?.search, $options: "i" };
		}
		if (filters?.type) {
			query.type = filters?.type;
		}
		if (
			filters?.availability !== undefined &&
			filters?.availability.toLowerCase() !== "all"
		) {
			query.disponibility = filters?.availability === "Available";
		}
		if (filters?.minPrice) {
			query.price = { ...query.price, $gte: parseFloat(filters?.minPrice) };
		}
		if (filters?.maxPrice) {
			query.price = { ...query.price, $lte: parseFloat(filters?.maxPrice) };
		}
		return query;
	}
	async getAllStocks(page = 1, limit = 10, filters = {}) {
		const query = this.buildFiltersQuery(filters);
		const skip = (page - 1) * limit;
		const [stocks, total] = await Promise.all([
			Stock.find(query)
				.populate("type")
				.skip(skip)
				.limit(limit)
				.sort({ createdAt: -1 }),
			Stock.countDocuments(),
		]);
		return {
			stocks,
			currentPage: page,
			totalPages: Math.ceil(total / limit),
			totalItems: total,
			limit,
		};
	}
	async getStockById(id) {
		return await Stock.findById(id).populate("type");
	}
	async updateStock(id, updateData) {
		const stock = await Stock.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true }
		).populate("type");
		emitStockUpdate(stock);
		if (stock.quantity <= stock.minQty) {
			emitStockAlert(stock);
		}
		return stock;
	}
	async deleteStock(id) {
		return await Stock.findByIdAndDelete(id);
	}
	async increaseQuantity(id, amount) {
		const stock = await Stock.findById(id).populate("type");
		if (!stock) {
			throw new Error("Stock item not found");
		}
		stock.quantity += amount;
		if (stock.quantity > stock.maxQty) {
			throw new Error(
				`Cannot exceed maximum quantity of ${stock.maxQty} ${stock.unit}`
			);
		}
		await stock.save();
		emitStockUpdate(stock);
		return stock;
	}
	async decreaseQuantity(id, amount) {
		const stock = await Stock.findById(id).populate("type");
		if (!stock) {
			throw new Error("Stock item not found");
		}
		stock.quantity -= amount;
		if (stock.quantity < 0) {
			throw new Error("Quantity cannot be negative");
		}
		await stock.save();
		if (stock.quantity <= stock.minQty) {
			emitStockAlert(stock);
		}
		emitStockUpdate(stock);
		return stock;
	}
	async getSuppliersForStock(stockId) {
		const stock = await Stock.findById(stockId);
		if (!stock) {
			throw new Error("Stock item not found");
		}
		const suppliers = await Supplier.find({
			"stocks.stockId": stockId,
			status: "active",
		});
		const normalize = (value, min, max) => (value - min) / (max - min);
		const calculateCompositeScore = (
			pricePerUnit,
			qualityScore,
			leadTimeDays
		) => {
			const minPrice = 1;
			const maxPrice = 10;
			const minLeadTime = 1;
			const maxLeadTime = 7;
			const minQuality = 0;
			const maxQuality = 100;
			const normalizedPrice = 1 - normalize(pricePerUnit, minPrice, maxPrice);
			const normalizedQuality = normalize(qualityScore, minQuality, maxQuality);
			const normalizedLeadTime =
				1 - normalize(leadTimeDays, minLeadTime, maxLeadTime);
			const score =
				(0.4 * normalizedPrice +
					0.3 * normalizedQuality +
					0.3 * normalizedLeadTime) *
				100;
			return Math.round(score);
		};
		const comparisonData = await Promise.all(
			suppliers.map(async (supplier) => {
				let stockEntry = supplier.stocks.find(
					(s) => s.stockId.toString() === stockId.toString()
				);
				// Refresh qualityScore dynamically
				let qualityScore = stockEntry.qualityScore;
				try {
					qualityScore = await SupplierService.calculateDynamicQualityScore(
						supplier._id
					);
					// Update supplier document
					await Supplier.updateOne(
						{ _id: supplier._id, "stocks.stockId": stockId },
						{ $set: { "stocks.$.qualityScore": qualityScore } }
					);
				} catch (error) {
					console.error("Error updating qualityScore:", error.message);
				}
				return {
					supplierId: supplier._id,
					supplierName: supplier.name,
					supplierEmail: supplier.contact.email,
					pricePerUnit: stockEntry.pricePerUnit,
					leadTimeDays: stockEntry.leadTimeDays,
					moq: stockEntry.moq,
					qualityScore,
					compositeScore: calculateCompositeScore(
						stockEntry.pricePerUnit,
						qualityScore,
						stockEntry.leadTimeDays
					),
				};
			})
		);
		return comparisonData;
	}
	async getStockById(id) {
		return await Stock.findById(id).populate("type");
	}
	async updateStock(id, updateData) {
		const stock = await Stock.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true }
		).populate("type");
		emitStockUpdate(stock);
		if (stock.quantity <= stock.minQty) {
			emitStockAlert(stock);
		}
		return stock;
	}
	async deleteStock(id) {
		return await Stock.findByIdAndDelete(id);
	}
	async increaseQuantity(id, amount) {
		const stock = await Stock.findById(id).populate("type");
		if (!stock) {
			throw new Error("Stock item not found");
		}
		stock.quantity += amount;
		if (stock.quantity > stock.maxQty) {
			throw new Error(
				`Cannot exceed maximum quantity of ${stock.maxQty} ${stock.unit}`
			);
		}
		await stock.save();
		emitStockUpdate(stock);
		return stock;
	}
	async decreaseQuantity(id, amount) {
		const stock = await Stock.findById(id).populate("type");
		if (!stock) {
			throw new Error("Stock item not found");
		}
		stock.quantity -= amount;
		if (stock.quantity < 0) {
			throw new Error("Quantity cannot be negative");
		}
		await stock.save();
		if (stock.quantity <= stock.minQty) {
			emitStockAlert(stock);
		}
		emitStockUpdate(stock);
		return stock;
	}
}
module.exports = new StockService();
