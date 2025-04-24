const mongoose = require("mongoose");
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true,
  },
  created_by: {
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
    //ref: "Supplier",
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "delivered", "cancelled"],
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
  deliveredAt: {
    type: Date,
    default: null,
  },
});

// Cascade delete items when invoice is deleted
invoiceSchema.pre("remove", async function (next) {
  const InvoiceItem = mongoose.model("InvoiceItem");
  await InvoiceItem.deleteMany({ invoice: this._id });
  next();
});
module.exports = mongoose.model("Invoice", invoiceSchema);
