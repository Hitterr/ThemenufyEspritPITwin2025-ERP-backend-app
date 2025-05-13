const { MongoClient } = require("mongodb"); // Add this import

class RecipeController {
  async getAllRecipes(req, res) {
    // Changed method name to match endpoint
    try {
      const client = new MongoClient("mongodb://localhost:27017");
      await client.connect();
      const db = client.db("the-menufy");
      const recipes = await db
        .collection("recipes")
        .aggregate([
          {
            $lookup: {
              from: "stocks",
              localField: "items.stockId",
              foreignField: "_id",
              as: "stockDetails",
            },
          },
          {
            $set: {
              items: {
                $map: {
                  input: "$items",
                  as: "item",
                  in: {
                    $mergeObjects: [
                      "$$item",
                      {
                        stockId: {
                          $arrayElemAt: [
                            "$stockDetails",
                            {
                              $indexOfArray: [
                                "$stockDetails._id",
                                "$$item.stockId",
                              ],
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          { $project: { stockDetails: 0 } },
        ])
        .toArray();
      await client.close();
      return res.status(200).json({ success: true, data: recipes });
    } catch (error) {
      console.error("Error in getAllRecipes:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new RecipeController();
