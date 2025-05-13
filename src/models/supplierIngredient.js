const mongoose = require("mongoose");
const { Schema } = mongoose;
const supplierStockSchema = new Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
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
supplierStockSchema.index({ supplierId: 1, stockId: 1 }, { unique: true });
module.exports = mongoose.model("SupplierStock", supplierStockSchema);
