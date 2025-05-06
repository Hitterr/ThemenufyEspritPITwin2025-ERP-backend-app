const Stock = require("../../../models/stock");
const { emitStockAlert, emitStockUpdate } = require("../sockets/socketStockService");
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
        if (filters?.availability !== undefined && filters?.availability.toLowerCase() !== "all") {
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
            throw new Error(`Cannot exceed maximum quantity of ${stock.maxQty} ${stock.unit}`);
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