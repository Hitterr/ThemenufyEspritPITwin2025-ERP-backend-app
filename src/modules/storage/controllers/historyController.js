const historyService = require("../services/historyService");
exports.createConsumption = async (req, res) => {
	try {
		const { restaurantId, ingredientId, ordreId } = req.body; // Utiliser req.body pour récupérer les données
		const { qty } = req.body;
		// Vérification des entrées
		if (!restaurantId || !ingredientId || !ordreId || !qty) {
			return res
				.status(400)
				.json({
					message:
						"Tous les paramètres (restaurantId, ingredientId,ordreId, qty) sont requis.",
				});
		}
		// Appel à la fonction de création
		const result = await historyService.createConsumption(
			ingredientId,
			restaurantId,
			ordreId,
			qty
		);
		res.status(201).json(result);
	} catch (err) {
		console.error("Erreur de création dans le contrôleur:", err);
		res
			.status(500)
			.json({ message: "Erreur de création", error: err.message || err });
	}
};
exports.getConsumption = async (req, res) => {
	try {
		const { restaurantId, ingredientId, ordreId } = req.query;
		// Vérification des paramètres de la requête
		if (!restaurantId && !ingredientId && !ordreId) {
			return res
				.status(400)
				.json({
					message:
						"Au moins un des paramètres (restaurantId ou ingredientId ou ordreId) doit être fourni.",
				});
		}
		// Appel à la fonction de récupération des consommations
		const results = await historyService.getConsumptions(
			restaurantId,
			ingredientId,
			ordreId
		);
		res.status(200).json(results);
	} catch (err) {
		console.error("Erreur de lecture dans le contrôleur:", err);
		res
			.status(500)
			.json({ message: "Erreur de lecture", error: err.message || err });
	}
};
exports.getDailyTrends = async (req, res) => {
	try {
		const { restaurantId } = req.params;
		const days = parseInt(req.query.days) || 30;
		if (!restaurantId) {
			return res.status(400).json({ message: "restaurantId est requis" });
		}
		const data = await historyService.getDailyTrends(restaurantId, days);
		res.status(200).json(data);
	} catch (err) {
		console.error("Erreur dans getDailyTrends controller:", err);
		res.status(500).json({
			message: "Erreur lors de la récupération des tendances",
			error: err.message,
		});
	}
};
