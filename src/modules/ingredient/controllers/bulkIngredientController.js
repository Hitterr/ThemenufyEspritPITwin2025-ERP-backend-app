const { bulkUpdateSchema } = require("../validators/ingredientValidator");
const ingredientService = require("../services/ingredientService");
const yup = require("yup");

class BulkUpdateIngredientController {
  async bulkUpdate(req, res) {
    try {
      console.log("📥 Requête reçue (bulkUpdate):", req.body);

      // Valider le schéma avec YUP
      await bulkUpdateSchema.validate(req.body, { abortEarly: false });

      const { ids, update } = req.body;

      const result = await ingredientService.bulkUpdateIngredients(ids, update);

      return res.status(200).json({
        success: true,
        message: "✅ Mise à jour en masse réussie",
        data: result,
      });
    } catch (error) {
      console.error("❌ Erreur attrapée dans bulkUpdate:");
      console.error("➡️ Détails de l'erreur:", error);

      if (error instanceof yup.ValidationError) {
        console.error("📛 Erreurs de validation YUP:", error.errors);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }
}

module.exports = new BulkUpdateIngredientController();
