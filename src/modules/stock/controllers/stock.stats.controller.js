const Stock = require("../../../models/Stock");
// assuming you have it for population
const getStockAnalysis = async (req, res) => {
  try {
    const restaurant = req.user.details.restaurant._id;
    // 1. Total number of stocks
    const totalStocks = await Stock.countDocuments({ restaurant });
    // 2. Total stock value
    const totalStockValueAgg = await Stock.aggregate([
      { $match: { restaurant } },
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: { $multiply: ["$quantity", "$price"] },
          },
        },
      },
    ]);
    const totalStockValue = totalStockValueAgg[0]?.totalValue || 0;
    // 3. Average price
    const averagePriceAgg = await Stock.aggregate([
      { $match: { restaurant } },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: "$price" },
        },
      },
    ]);
    const averagePrice = averagePriceAgg[0]?.avgPrice || 0;
    // 4. Stocks below minimum quantity
    const lowStockCount = await Stock.countDocuments({
      restaurant,

      $expr: { $lt: ["$quantity", "$minQty"] },
    });
    // 5. Stocks at or above max quantity
    const atMaxStockCount = await Stock.countDocuments({
      restaurant,

      $expr: { $gte: ["$quantity", "$maxQty"] },
    });
    // 6. Out of stock or unavailable stocks
    const outOfStockCount = await Stock.countDocuments({
      restaurant,

      $or: [{ quantity: { $eq: 0 } }, { disponibility: false }],
    });
    // 7. Stock count per category
    const stockPerCategory = await Stock.aggregate([
      { $match: { restaurant } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          _id: 0,
          category: "$category.name",
          count: 1,
        },
      },
    ]);
    // 8. Stock value per category
    const stockValuePerCategory = await Stock.aggregate([
      { $match: { restaurant } },
      {
        $group: {
          _id: "$type",
          value: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          _id: 0,
          category: "$category.name",
          value: 1,
        },
      },
    ]);
    // 9. List of low stock stocks
    const lowStockList = await Stock.find({
      restaurant,

      $expr: { $lt: ["$quantity", "$minQty"] },
    })
      .sort({ quantity: 1 })
      .select("libelle quantity minQty unit");
    // 10. Recently updated stocks
    const recentlyUpdated = await Stock.find({ restaurant })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("libelle updatedAt");
    // 11. Unit distribution
    const unitDistribution = await Stock.aggregate([
      { $match: { restaurant } },
      {
        $group: {
          _id: "$unit",
          count: { $sum: 1 },
        },
      },
    ]);
    // 12. Top 5 most expensive stocks
    const mostExpensive = await Stock.find({ restaurant })
      .sort({ price: -1 })
      .limit(5)
      .select("libelle price unit");
    // Final Response
    res.json({
      success: true,
      data: {
        totalStocks,
        totalStockValue,
        averagePrice,
        lowStockCount,
        atMaxStockCount,
        outOfStockCount,
        stockPerCategory,
        stockValuePerCategory,
        lowStockList,
        recentlyUpdated,
        unitDistribution,
        mostExpensive,
      },
    });
  } catch (err) {
    console.error("Error fetching Stock stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { getStockAnalysis };
