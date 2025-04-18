const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update total when saving
invoiceSchema.pre("save", async function (next) {
  const InvoiceItem = mongoose.model("InvoiceItem");
  const items = await InvoiceItem.find({ invoice: this._id });
  this.total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  this.updatedAt = new Date();
  next();
});

// Cascade delete items when invoice is deleted
invoiceSchema.pre("remove", async function (next) {
  const InvoiceItem = mongoose.model("InvoiceItem");
  await InvoiceItem.deleteMany({ invoice: this._id });
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
