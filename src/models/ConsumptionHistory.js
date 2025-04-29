// models/ConsumptionHistory.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const consumptionHistorySchema = new Schema({
	restaurantId: {
		type: Schema.Types.ObjectId,
		ref: "Restaurant",
		required: [true, "L'ID du restaurant est requis"],
		index: true,
	},
	ingredientId: {
		type: Schema.Types.ObjectId,
		ref: "Ingredient",
		required: [true, "L'ID de l'ingrédient est requis"],
		index: true,
	},
	 
	
	wastageQty: { 
    type: Number,
    required: false
  },

  
	ordreId: {
		type: Schema.Types.ObjectId,
		ref: "Order",
		required: false,
	},
	qty: {
		type: Number,
		required: [true, "La quantité utilisée est requise"],
		min: [0, "La quantité utilisée ne peut pas être négative"],
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
});
// Index composé pour optimiser les requêtes de tendances
consumptionHistorySchema.index({
	restaurantId: 1,
	ingredientId: 1,
	createdAt: 1,
});
module.exports = mongoose.model("ConsumptionHistory", consumptionHistorySchema);
