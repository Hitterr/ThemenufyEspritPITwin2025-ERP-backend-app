const Category = require("../../../models/category");
const createCategory = async (data) => {
	return await Category.create(data);
};
const getCategories = async (page = 1, limit = 10) => {
	const skip = (page - 1) * limit;
	const categories = await Category.find().skip(skip).limit(limit);
	const total = await Category.countDocuments();
	return {
		categories,
		currentPage: page,
		totalPages: Math.ceil(total / limit),
		totalItems: total,
	};
};
const getCategoryById = async (id) => {
	return await Category.findById(id).populate("subCategories");
};
const updateCategory = async (id, data) => {
	return await Category.findByIdAndUpdate(id, data, { new: true });
};
const deleteCategory = async (id) => {
	return await Category.findByIdAndDelete(id);
};
const addSubCategory = async (categoryId, subCategoryId) => {
	const category = await Category.findById(categoryId);
	if (!category) {
		throw new Error("Category not found");
	}
	const subCategory = await Category.findById(subCategoryId);
	if (!subCategory) {
		throw new Error("Subcategory not found");
	}
	if (category.subCategories.includes(subCategoryId)) {
		throw new Error("Subcategory already exists in this category");
	}
	category.subCategories.push(subCategoryId);
	await category.save();
	return category;
};
const removeSubCategory = async (categoryId, subCategoryId) => {
	const category = await Category.findById(categoryId);
	if (!category) {
		throw new Error("Category not found");
	}
	const subCategory = await Category.findById(subCategoryId);
	if (!subCategory) {
		throw new Error("Subcategory not found");
	}
	if (!category.subCategories.includes(subCategoryId)) {
		throw new Error("Subcategory does not exist in this category");
	}
	console.log("Subcategory ID:", subCategoryId);
	category.subCategories = category.subCategories.filter(
		(id) => id.toString() !== subCategoryId
	);
	await category.save();
	return category;
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
