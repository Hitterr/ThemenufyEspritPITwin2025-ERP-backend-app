const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true
  },
  ingredient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ingredient",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number
  },
  libelle: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Populate ingredient details before saving
invoiceItemSchema.pre("save", async function(next) {
  const ingredient = await mongoose.model("Ingredient").findById(this.ingredient);
  if (ingredient) {
    this.price = ingredient.price;
    this.libelle = ingredient.libelle;
  }
  next();
});

module.exports = mongoose.model("InvoiceItem", invoiceItemSchema);