const { get } = require("mongoose");
const Ingredient = require("../../../models/ingredient");
const {
	emitIngredientAlert,
	emitIngredientUpdate,
} = require("../sockets/socketIngredientService");
class IngredientService {
	async createIngredient(ingredientData) {
		let ingredient = new Ingredient(ingredientData);
		ingredient = await ingredient.save();
		return this.getIngredientById(ingredient._doc._id);
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
	async getAllIngredients(page = 1, limit = 10, filters = {}) {
		const query = this.buildFiltersQuery(filters);
		const skip = (page - 1) * limit;
		const [ingredients, total] = await Promise.all([
			Ingredient.find(query)
				.populate("type")
				.skip(skip)
				.limit(limit)
				.sort({ createdAt: -1 }),
			Ingredient.countDocuments(),
		]);
		return {
			ingredients,
			currentPage: page,
			totalPages: Math.ceil(total / limit),
			totalItems: total,
			limit,
		};
	}
	async getIngredientById(id) {
		return await Ingredient.findById(id).populate("type");
	}
	async updateIngredient(id, updateData) {
		const ingredient = await Ingredient.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true }
		).populate("type");
		emitIngredientUpdate(ingredient);
		// Check if quantity is at or below minQty and emit alert
		if (ingredient.quantity <= ingredient.minQty) {
			emitIngredientAlert(ingredient);
		}
		return ingredient;
	}
	async deleteIngredient(id) {
		const result = await Ingredient.findByIdAndDelete(id);
		return result;
	}
	async increaseQuantity(id, amount) {
		const ingredient = await Ingredient.findById(id).populate("type");
		if (!ingredient) {
			throw new Error("Ingredient not found");
		}
		ingredient.quantity += amount;
		if (ingredient.quantity > ingredient.maxQty) {
			throw new Error(
				`Cannot exceed maximum quantity of ${ingredient.maxQty} ${ingredient.unit}`
			);
		}
		await ingredient.save();
		emitIngredientUpdate(ingredient);
		return ingredient;
	}
	async decreaseQuantity(id, amount) {
		const ingredient = await Ingredient.findById(id).populate("type");
		if (!ingredient) {
			throw new Error("Ingredient not found");
		}
		ingredient.quantity -= amount;
		if (ingredient.quantity < 0) {
			throw new Error("Quantity cannot be negative");
		}
		await ingredient.save();
		// Check if quantity is at or below minQty and emit alert
		if (ingredient.quantity <= ingredient.minQty) {
			emitIngredientAlert(ingredient);
		}
		emitIngredientUpdate(ingredient);
		return ingredient;
	}
}
module.exports = new IngredientService();
