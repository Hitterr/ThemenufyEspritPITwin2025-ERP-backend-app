const mongoose = require("mongoose");
const invoiceItemSchema = new mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true,
  },
  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
// Populate Stock details before saving
invoiceItemSchema.pre("save", async function (next) {
  const stock = await mongoose.model("Stock").findById(this.stock);
  if (stock) {
    this.price = stock.price;
    this.libelle = stock.libelle;
  }
  next();
});
module.exports = mongoose.model("InvoiceItem", invoiceItemSchema);
