const Stock = require("../../../models/stock");
const Supplier = require("../../../models/supplier");

class SupplierController {
  async compareSuppliers(req, res) {
    try {
      const { stockId, sortBy = "price", order = "asc" } = req.query;

      // Validate stockId
      if (!stockId) {
        return res.status(400).json({
          success: false,
          message: "stockId is required",
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

      const suppliers = await Supplier.find().populate("stocks.stockId");

      let comparisonData = [];
      suppliers.forEach((supplier) => {
        // Find the specific stock for this supplier
        const stock = supplier.stocks.find(
          (ing) => ing.stockId?._id.toString() === stockId
        );

        if (stock) {
          comparisonData.push({
            supplierId: supplier._id,
            supplierName: supplier.name,
            stockId: stock.stockId._id,
            stockName: stock.stockId.libelle,
            price: stock.pricePerUnit || 0, // Correct field name
            deliveryTime: stock.leadTimeDays || 0, // Correct field name
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
