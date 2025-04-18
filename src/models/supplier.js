const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2"); // Add this import

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
      maxlength: [100, "Supplier name cannot exceed 100 characters"],
    },
    contact: {
      phone: {
        type: String,
        trim: true,
        match: [
          /^\+?[1-9]\d{1,14}$/,
          "Please enter a valid phone number with country code",
        ],
        required: [true, "Phone number is required"],
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
        required: [true, "Email is required"],
      },
      representative: {
        type: String,
        trim: true,
        maxlength: [100, "Representative name cannot exceed 100 characters"],
      },
    },
    address: {
      street: { type: String, trim: true, required: true },
      city: { type: String, trim: true, required: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true, default: "Canada" },
    },
    contract: {
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      terms: {
        type: String,
        enum: ["NET_30", "NET_60", "COD", "Custom"],
        default: "NET_30",
      },
      specialConditions: { type: String },
      minimumOrder: { type: Number, min: 0 },
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
        enum: ["bank", "credit", "check"],
        default: "bank",
      },
      accountDetails: { type: String },
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Restaurant reference is required"],
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for contract duration in days
supplierSchema.virtual("contract.durationDays").get(function () {
  if (!this.contract.endDate) return null;
  const diff = this.contract.endDate - this.contract.startDate;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Indexes for better query performance
supplierSchema.index({ name: 1 });
supplierSchema.index({ restaurantId: 1 });
supplierSchema.index({ status: 1 });
supplierSchema.index({ "contact.email": 1 }, { unique: true });

// Pre-save hook to validate contract dates
supplierSchema.pre("save", function (next) {
  if (
    this.contract.endDate &&
    this.contract.endDate < this.contract.startDate
  ) {
    throw new Error("Contract end date must be after start date");
  }
  next();
});

// Query helper for active suppliers
supplierSchema.query.active = function () {
  return this.where({ status: "active" });
};

// Static method to find by email
supplierSchema.statics.findByEmail = function (email) {
  return this.findOne({ "contact.email": email.toLowerCase() });
};

// Instance method to get contract status
supplierSchema.methods.getContractStatus = function () {
  if (this.status !== "active") return this.status;
  if (!this.contract.endDate) return "active";
  return this.contract.endDate > new Date() ? "active" : "expired";
};

// Add pagination plugin
supplierSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Supplier", supplierSchema);
