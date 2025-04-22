const Ingredient = require("../../../models/Ingredient");
const supplier = require("../../../models/supplier");

class SupplierController {
  async compareSuppliers(req, res) {
    try {
      const { ingredientId, sortBy = "price", order = "asc" } = req.query;

      const suppliers = await supplier.find().populate("ingredients.ingredientId");

      let comparisonData = [];
      suppliers.forEach((supplier) => {
        supplier.ingredients.forEach((ing) => {
          if (!ingredientId || ing.ingredientId._id.toString() === ingredientId) {
            comparisonData.push({
              supplierId: supplier._id,
              supplierName: supplier.name,
              ingredientId: ing.ingredientId._id,
              ingredientName: ing.ingredientId.libelle,
              price: ing.price,
              deliveryTime: ing.deliveryTime,
            });
          }
        });
      });

      comparisonData.sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];
        if (sortBy === "supplierName") {
          return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
        return order === "asc" ? valueA - valueB : valueB - valueA;
      });

      return res.status(200).json({
        success: true,
        data: comparisonData,
      });
    } catch (error) {
      console.error("Erreur dans compareSuppliers:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Erreur serveur",
      });
    }
  }
}

module.exports = new SupplierController();