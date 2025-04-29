// models/ForecastedSales.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const forecastedSalesSchema = new Schema({
  menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  forecastedQty: { type: Number, required: true }, 
  forecastDate: { type: Date, required: true },    
}, { timestamps: true });

module.exports = mongoose.model('ForecastedSales', forecastedSalesSchema);
