const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    orderNb: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    tableNb: {
      type: String,
      required: true,
      trim: true,
    },
    statusOrder: {
      type: String,
      required: true,
      trim: true,
    },
    statusPay: {
      type: String,
      required: true,
      trim: true,
    },
    durationPreparation: {
      type: String,
      required: true,
      trim: true,
    },
    noteClient: {
      type: String,
      trim: true,
    },
    suggestion: {
      type: String,
      trim: true,
    },
    code_Promo: {
      type: String,
      trim: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    CartFK: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    BillFK: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    UserFK: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

// Index orderNb for faster lookups
orderSchema.index({ orderNb: 1 });

module.exports = mongoose.model("Order", orderSchema);