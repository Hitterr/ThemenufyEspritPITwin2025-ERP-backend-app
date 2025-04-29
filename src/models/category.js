const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		description: {
			type: String,
			default: "",
		},
		subCategories: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Category",
			},
		],
	},
	{
		timestamps: true,
	}
);
const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
