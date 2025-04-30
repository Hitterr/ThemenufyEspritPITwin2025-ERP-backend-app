const { MongoClient } = require("mongodb"); // Add this import

class RecipeController {
  async getAllRecipes(req, res) { // Changed method name to match endpoint
    try {
      const client = new MongoClient("mongodb://localhost:27017");
      await client.connect();
      const db = client.db("the-menufy");
      const recipes = await db
        .collection("recipes")
        .aggregate([
          {
            $lookup: {
              from: "ingredients",
              localField: "items.ingredientId",
              foreignField: "_id",
              as: "ingredientDetails",
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
                        ingredientId: {
                          $arrayElemAt: [
                            "$ingredientDetails",
                            {
                              $indexOfArray: ["$ingredientDetails._id", "$$item.ingredientId"],
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
          { $project: { ingredientDetails: 0 } },
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