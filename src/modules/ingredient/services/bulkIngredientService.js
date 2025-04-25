const mongoose = require("mongoose");
const Ingredient = require("../../../models/Ingredient");
const {
  emitIngredientUpdate,
  emitIngredientAlert,
} = require("../sockets/socketIngredientService");

class BulkIngredientService {
  async bulkUpdateIngredients(ids, update) {
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    const result = await Ingredient.updateMany(
      { _id: { $in: objectIds } },
      { $set: update }
    );

    const updated = await Ingredient.find({ _id: { $in: objectIds } });
    updated.forEach((ingredient) => {
      emitIngredientUpdate(ingredient);
      if (ingredient.quantity <= ingredient.minQty) emitIngredientAlert(ingredient);
    });

    return result;
  }
}

module.exports = new BulkIngredientService();
