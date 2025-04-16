const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  ingredient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ingredient",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
  },
  libelle: {
    type: String,
  },
});

const invoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [invoiceItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to populate ingredient details before saving
invoiceSchema.pre("save", async function (next) {
  for (const item of this.items) {
    const ingredient = await mongoose
      .model("Ingredient")
      .findById(item.ingredient);
    if (ingredient) {
      item.price = ingredient.price;
      item.libelle = ingredient.libelle;
    }
  }
  // Calculate total amount
  this.totalAmount = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
