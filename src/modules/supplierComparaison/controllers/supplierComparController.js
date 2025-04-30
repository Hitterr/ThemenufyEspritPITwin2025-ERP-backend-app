const Ingredient = require("../../../models/ingredient");
const Supplier = require("../../../models/supplier");

class SupplierController {
  async compareSuppliers(req, res) {
    try {
      const { ingredientId, sortBy = "price", order = "asc" } = req.query;

      // Validate ingredientId
      if (!ingredientId) {
        return res.status(400).json({
          success: false,
          message: "ingredientId is required",
        });
      }

      // Validate sortBy
      const validSortKeys = ["supplierName", "price", "deliveryTime"];
      if (!validSortKeys.includes(sortBy)) {
        return res.status(400).json({
          success: false,
          message: `sortBy must be one of: ${validSortKeys.join(", ")}`,
        });
      }

      const suppliers = await Supplier.find().populate("ingredients.ingredientId");

      let comparisonData = [];
      suppliers.forEach((supplier) => {
        // Find the specific ingredient for this supplier
        const ingredient = supplier.ingredients.find(
          (ing) => ing.ingredientId?._id.toString() === ingredientId
        );

        if (ingredient) {
          comparisonData.push({
            supplierId: supplier._id,
            supplierName: supplier.name,
            ingredientId: ingredient.ingredientId._id,
            ingredientName: ingredient.ingredientId.libelle,
            price: ingredient.pricePerUnit || 0, // Correct field name
            deliveryTime: ingredient.leadTimeDays || 0, // Correct field name
          });
        }
      });

      // Sort the data
      comparisonData.sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];
        if (sortBy === "supplierName") {
          return order === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
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