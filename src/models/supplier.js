const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: {
      email: { type: String, required: true, unique: true }, // Add unique index for email
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
  { timestamps: true } // Add timestamps
);

// Indexes for better query performance
supplierSchema.index({ "contact.email": 1 }, { unique: true });
supplierSchema.index({ status: 1 });
supplierSchema.index({ restaurantId: 1 });

// Apply the pagination plugin
supplierSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Supplier", supplierSchema);