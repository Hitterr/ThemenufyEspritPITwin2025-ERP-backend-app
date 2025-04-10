const mongoose = require("mongoose");
const { Schema } = mongoose;

const SupplierSchema = new mongoose.Schema({
  name: String,
  ingredients: [
    {
      ingredientId: mongoose.Schema.Types.ObjectId,
      price: Number,
      deliveryTime: Number, 
    }
  ]
});

module.exports = mongoose.model("Supplier", SupplierSchema);
