const Category = require("../../../models/category");

const createCategory = async (data) => {
  return await Category.create(data);
};

const getCategories = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const categories = await Category.find()
        .skip(skip)
        .limit(limit);
    
    const total = await Category.countDocuments();
    
    return {
        categories,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
    };
};

const getCategoryById = async (id) => {
  return await Category.findById(id);
};

const updateCategory = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
