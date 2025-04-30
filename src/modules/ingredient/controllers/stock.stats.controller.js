const Ingredient = require("../../../models/ingredient");
// assuming you have it for population
const getStockAnalysis = async (req, res) => {
	try {
		// 1. Total number of ingredients
		const totalIngredients = await Ingredient.countDocuments();
		// 2. Total stock value
		const totalStockValueAgg = await Ingredient.aggregate([
			{
				$group: {
					_id: null,
					totalValue: {
						$sum: { $multiply: ["$quantity", "$price"] },
					},
				},
			},
		]);
		const totalStockValue = totalStockValueAgg[0]?.totalValue || 0;
		// 3. Average price
		const averagePriceAgg = await Ingredient.aggregate([
			{
				$group: {
					_id: null,
					avgPrice: { $avg: "$price" },
				},
			},
		]);
		const averagePrice = averagePriceAgg[0]?.avgPrice || 0;
		// 4. Ingredients below minimum quantity
		const lowStockCount = await Ingredient.countDocuments({
			$expr: { $lt: ["$quantity", "$minQty"] },
		});
		// 5. Ingredients at or above max quantity
		const atMaxStockCount = await Ingredient.countDocuments({
			$expr: { $gte: ["$quantity", "$maxQty"] },
		});
		// 6. Out of stock or unavailable ingredients
		const outOfStockCount = await Ingredient.countDocuments({
			$or: [{ quantity: { $eq: 0 } }, { disponibility: false }],
		});
		// 7. Ingredient count per category
		const ingredientPerCategory = await Ingredient.aggregate([
			{
				$group: {
					_id: "$type",
					count: { $sum: 1 },
				},
			},
			{
				$lookup: {
					from: "categories",
					localField: "_id",
					foreignField: "_id",
					as: "category",
				},
			},
			{
				$unwind: "$category",
			},
			{
				$project: {
					_id: 0,
					category: "$category.name",
					count: 1,
				},
			},
		]);
		// 8. Stock value per category
		const stockValuePerCategory = await Ingredient.aggregate([
			{
				$group: {
					_id: "$type",
					value: { $sum: { $multiply: ["$quantity", "$price"] } },
				},
			},
			{
				$lookup: {
					from: "categories",
					localField: "_id",
					foreignField: "_id",
					as: "category",
				},
			},
			{
				$unwind: "$category",
			},
			{
				$project: {
					_id: 0,
					category: "$category.name",
					value: 1,
				},
			},
		]);
		// 9. List of low stock ingredients
		const lowStockList = await Ingredient.find({
			$expr: { $lt: ["$quantity", "$minQty"] },
		})
			.sort({ quantity: 1 })
			.select("libelle quantity minQty unit");
		// 10. Recently updated ingredients
		const recentlyUpdated = await Ingredient.find()
			.sort({ updatedAt: -1 })
			.limit(5)
			.select("libelle updatedAt");
		// 11. Unit distribution
		const unitDistribution = await Ingredient.aggregate([
			{
				$group: {
					_id: "$unit",
					count: { $sum: 1 },
				},
			},
		]);
		// 12. Top 5 most expensive ingredients
		const mostExpensive = await Ingredient.find()
			.sort({ price: -1 })
			.limit(5)
			.select("libelle price unit");
		// Final Response
		res.json({
			success: true,
			data: {
				totalIngredients,
				totalStockValue,
				averagePrice,
				lowStockCount,
				atMaxStockCount,
				outOfStockCount,
				ingredientPerCategory,
				stockValuePerCategory,
				lowStockList,
				recentlyUpdated,
				unitDistribution,
				mostExpensive,
			},
		});
	} catch (err) {
		console.error("Error fetching ingredient stats:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};
module.exports = { getStockAnalysis };
