const mongoose = require("mongoose");
const { Schema } = mongoose;
const stockSchema = new Schema(
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
		shelfLifeDays: {
			type: Number,
			required: true,
			min: 1,
			default: 30,
		  },
		unit: {
			type: String,
			enum: ["g", "kg", "mg", "l", "ml", "cl", "pcs"],
			required: true,
			trim: true,
		},
		restaurant: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Restaurant",
			required: false,
		},
		qrCode: {
			type: String,
			required: false,
			default: null,
		},
		shelfLifeDays: {
			type: Number,
			required: true,
			min: 1,
			default: 30,
		},
	},
	{ timestamps: true }
);
stockSchema.index({ libelle: 1 });
const Stock = mongoose.models.Stock || mongoose.model("Stock", stockSchema);
module.exports = Stock;
