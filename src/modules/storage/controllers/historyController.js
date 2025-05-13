const historyService = require("../services/historyService");
exports.createConsumption = async (req, res) => {
	try {
		const { restaurantId, stockId, ordreId } = req.body; // Utiliser req.body pour récupérer les données
		const { qty, wastageQty = 0 } = req.body;
		// Vérification des entrées
		if (!restaurantId || !stockId || !ordreId || !qty) {
			return res.status(400).json({
				message:
					"Tous les paramètres (restaurantId, stockId,ordreId, qty,wastageQty) sont requis.",
			});
		}
		// Appel à la fonction de création
		const result = await historyService.createConsumption(
			stockId,
			restaurantId,
			ordreId,
			qty,
			wastageQty
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
		const { stockId = "", ordreId = "" } = req.query;
		restaurantId = req.user.details.restaurant._id;
		if (!restaurantId) throw new Error("restaurantId is required");
		// Appel à la fonction de récupération des consommations
		const results = await historyService.getConsumptions(
			restaurantId,
			stockId,
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
