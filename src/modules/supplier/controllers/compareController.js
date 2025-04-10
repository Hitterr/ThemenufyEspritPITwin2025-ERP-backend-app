const supplier = require("../../../models/supplier");

const compareSuppliers = async (req, res) => {
  const { ingredientId } = req.params;

  try {
    const suppliers = await supplier.find({
      'ingredients.ingredientId': ingredientId
    });

    const results = suppliers.map(supplier => {
      const ingredientInfo = supplier.ingredients.find(i =>
        i.ingredientId.toString() === ingredientId
      );
      return {
        name: supplier.name,
        price: ingredientInfo.price,
        deliveryTime: ingredientInfo.deliveryTime,
      };
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  compareSuppliers,
};
