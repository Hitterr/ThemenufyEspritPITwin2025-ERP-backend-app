const { getIO } = require("../../../config/socket");
const emitIngredientAlert = (ingredient) => {
	const io = getIO();
	io.emit("ingredient-alert", {
		message: `Low stock alert: ${ingredient.libelle} is running low! Current quantity: ${ingredient.quantity} ${ingredient.unit}`,
		ingredient: ingredient,
	});
};
module.exports = {
	emitIngredientAlert,
};
