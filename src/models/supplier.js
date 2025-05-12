const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    stocks: [
      {
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
        moq: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        qualityScore: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
          default: 80,
        },
      },
    ],
    contact: {
      email: { type: String, required: true, unique: true },
      phone: String,
      representative: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: "Canada" },
    },
    contract: {
      startDate: { type: Date, required: true },
      endDate: Date,
      terms: {
        type: String,
        enum: ["NET_30", "NET_60", "COD", "Custom"],
        default: "NET_30",
      },
      minimumOrder: { type: Number, min: 0 },
      specialConditions: String,
    },
    status: {
      type: String,
      enum: ["active", "pending", "suspended", "inactive"],
      default: "active",
    },
    payment: {
      currency: { type: String, default: "CAD" },
      preferredMethod: {
        type: String,
        enum: ["bank", "credit", "cash"],
        default: "bank",
      },
      accountDetails: String,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: false,
    },
    notes: String,
  },
  { timestamps: true }
);

// Indexes for better query performance
supplierSchema.index({ "contact.email": 1 }, { unique: true });
supplierSchema.index({ status: 1 });
supplierSchema.index({ restaurantId: 1 });
supplierSchema.index({ "stocks.stockId": 1 }); // Index for faster stock lookups

// Apply the pagination plugin
supplierSchema.plugin(mongoosePaginate);

module.exports =
  mongoose.models.Supplier || mongoose.model("Supplier", supplierSchema);