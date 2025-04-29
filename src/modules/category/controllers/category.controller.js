const categoryService = require("../services/category.service");
const createCategory = async (req, res) => {
	try {
		const category = await categoryService.createCategory(req.body);
		res.status(201).json(category);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
const getCategories = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const result = await categoryService.getCategories(page, limit);
		res.json({
			success: true,
			data: result.categories,
			pagination: {
				currentPage: result.currentPage,
				totalPages: result.totalPages,
				totalItems: result.totalItems,
				limit: limit,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
const getCategoryById = async (req, res) => {
	try {
		const category = await categoryService.getCategoryById(req.params.id);
		if (!category) return res.status(404).json({ error: "Category not found" });
		res.json(category);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
const updateCategory = async (req, res) => {
	try {
		const category = await categoryService.updateCategory(
			req.params.id,
			req.body
		);
		if (!category) return res.status(404).json({ error: "Category not found" });
		res.json(category);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
const deleteCategory = async (req, res) => {
	try {
		const category = await categoryService.deleteCategory(req.params.id);
		if (!category) return res.status(404).json({ error: "Category not found" });
		res.json({ message: "Category deleted" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
const addSubCategory = async (req, res) => {
	try {
		const { categoryId } = req.body;
		if (req.body.name && req.body.description) {
			const subCategory = await categoryService.createCategory({
				name: req.body.name,
				description: req.body.description,
			});
			req.body.subCategoryId = subCategory._id;
		}
		const category = await categoryService.addSubCategory(
			categoryId,
			req.body.subCategoryId
		);
		if (!category) return res.status(404).json({ error: "Category not found" });
		res.json(category);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
const removeSubCategory = async (req, res) => {
	try {
		const { categoryId, subCategoryId } = req.body;
		console.log("📢 [category.controller.js:75]", categoryId, subCategoryId);
		const category = await categoryService.removeSubCategory(
			categoryId,
			subCategoryId
		);
		if (!category) return res.status(404).json({ error: "Category not found" });
		res.json(category);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
module.exports = {
	createCategory,
	getCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
	addSubCategory,
	removeSubCategory,
};
