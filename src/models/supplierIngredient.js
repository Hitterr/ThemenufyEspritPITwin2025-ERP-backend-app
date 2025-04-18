// models/SupplierIngredient.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const supplierIngredientSchema = new Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },
    leadTimeDays: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

// Index for faster lookups
supplierIngredientSchema.index(
  { supplierId: 1, ingredientId: 1 },
  { unique: true }
);

module.exports = mongoose.model("SupplierIngredient", supplierIngredientSchema);
