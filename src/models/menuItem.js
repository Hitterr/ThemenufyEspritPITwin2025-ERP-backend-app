const mongoose = require('mongoose');
const { Schema } = mongoose;

const menuItemSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  ingredients: [
    {
      ingredientId: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true },
      quantity: { type: Number, required: true } 
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
