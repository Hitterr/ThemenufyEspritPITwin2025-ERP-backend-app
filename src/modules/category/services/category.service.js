const Category = require("../../../models/category");
const createCategory = async (data) => {
  return await Category.create(data);
};
const getCategories = async (filters = { page: 1, limit: 10 }) => {
  try {
    const query = buildFiltersQuery(filters);
    const page = parseInt(filters.page, 10) || 1; // Convertir la chaîne en nombre entier
    const limit = parseInt(filters.limit, 10) || 10; // Convertir la chaîne en nombre entier
    // ================================================
    const skip = (page - 1) * limit;
    const categories = await Category.find(query).skip(skip).limit(limit);
    const total = await Category.countDocuments();
    return {
      categories,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  } catch (error) {
    console.error(error);
  }
};
const getCategoryById = async (id, restaurant) => {
  return await Category.findOne({ _id: id, restaurant }).populate(
    "subCategories"
  );
};
const updateCategory = async (id, data, restaurant) => {
  return await Category.findOneAndUpdate({ _id: id, restaurant }, data, {
    new: true,
  });
};
const deleteCategory = async (id, restaurant) => {
  return await Category.findOneAndDelete({ _id: id, restaurant });
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
const buildFiltersQuery = (filters) => {
  const query = {};
  if (filters?.search) {
    query.name = { $regex: filters?.search, $options: "i" };
  }
  if (filters?.restaurant) {
    query.restaurant = filters?.restaurant;
  }
  return query;
};
module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  addSubCategory,
  removeSubCategory,
  buildFiltersQuery,
};
