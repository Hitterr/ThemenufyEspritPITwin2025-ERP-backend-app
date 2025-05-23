const mongoose = require("mongoose");
const { Schema } = mongoose;
const ingredientSchema = new Schema(
	{
		libelle: {
			type: String,
			required: true,
			trim: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: 0,
		},
		type: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		disponibility: {
			type: Boolean,
			default: true,
		},
		maxQty: {
			type: Number,
			required: true,
			min: 0,
		},
		minQty: {
			type: Number,
			required: true,
			min: 0,
		},
		unit: {
			type: String,
			enum: ["g", "kg", "mg", "l", "ml", "cl", "pcs"],
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);
ingredientSchema.index({ libelle: 1 });
const Ingredient =
	mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientSchema);
module.exports = Ingredient;
