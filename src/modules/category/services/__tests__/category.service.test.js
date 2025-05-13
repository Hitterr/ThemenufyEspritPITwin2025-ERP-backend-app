const categoryService = require("../category.service");
const Category = require("../../../../models/category");

// Mock the Category model
jest.mock("../../../../models/category");

describe("Category Service", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    Category.mockClear();
    Category.create.mockClear();
    Category.find.mockClear();
    Category.findById.mockClear();
    Category.findByIdAndUpdate.mockClear();
    Category.findByIdAndDelete.mockClear();
    Category.countDocuments.mockClear();
  });

  describe("createCategory", () => {
    it("should create a category", async () => {
      const categoryData = {
        name: "Test Category",
        description: "Test Description",
      };
      const createdCategory = { _id: "1", ...categoryData };
      Category.create.mockResolvedValue(createdCategory);

      const result = await categoryService.createCategory(categoryData);

      expect(Category.create).toHaveBeenCalledWith(categoryData);
      expect(result).toEqual(createdCategory);
    });
  });

  describe("getCategories", () => {
    it("should get categories with pagination", async () => {
      const categories = [{ name: "Category 1" }, { name: "Category 2" }];
      const total = 2;
      Category.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(categories),
      });
      Category.countDocuments.mockResolvedValue(total);

      const result = await categoryService.getCategories(1, 10);

      expect(Category.find).toHaveBeenCalled();
      expect(Category.countDocuments).toHaveBeenCalled();
      expect(result.categories).toEqual(categories);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.totalItems).toBe(total);
    });
  });

  describe("getCategoryById", () => {
    it("should get a category by ID with subcategories populated", async () => {
      const categoryId = "1";
      const category = {
        _id: categoryId,
        name: "Test Category",
        subCategories: [],
      };
      Category.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(category),
      });

      const result = await categoryService.getCategoryById(categoryId);

      expect(Category.findById).toHaveBeenCalledWith(categoryId);
      expect(Category.findById().populate).toHaveBeenCalledWith(
        "subCategories"
      );
      expect(result).toEqual(category);
    });
  });

  describe("updateCategory", () => {
    it("should update a category", async () => {
      const categoryId = "1";
      const updateData = { name: "Updated Category" };
      const updatedCategory = { _id: categoryId, ...updateData };
      Category.findByIdAndUpdate.mockResolvedValue(updatedCategory);

      const result = await categoryService.updateCategory(
        categoryId,
        updateData
      );

      expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
        categoryId,
        updateData,
        { new: true }
      );
      expect(result).toEqual(updatedCategory);
    });
  });

  describe("deleteCategory", () => {
    it("should delete a category", async () => {
      const categoryId = "1";
      const deletedCategory = { _id: categoryId, name: "Test Category" };
      Category.findByIdAndDelete.mockResolvedValue(deletedCategory);

      const result = await categoryService.deleteCategory(categoryId);

      expect(Category.findByIdAndDelete).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual(deletedCategory);
    });
  });

  describe("addSubCategory", () => {
    let mockCategoryInstance;

    beforeEach(() => {
      mockCategoryInstance = {
        _id: "cat1",
        name: "Parent Category",
        subCategories: [],
        save: jest.fn().mockResolvedValue(this),
      };
    });

    it("should add a subcategory to a category", async () => {
      const categoryId = "cat1";
      const subCategoryId = "sub1";
      const subCategory = { _id: subCategoryId, name: "Sub Category" };

      Category.findById.mockImplementation((id) => {
        if (id === categoryId) return Promise.resolve(mockCategoryInstance);
        if (id === subCategoryId) return Promise.resolve(subCategory);
        return Promise.resolve(null);
      });

      const result = await categoryService.addSubCategory(
        categoryId,
        subCategoryId
      );

      expect(Category.findById).toHaveBeenCalledWith(categoryId);
      expect(Category.findById).toHaveBeenCalledWith(subCategoryId);
      expect(mockCategoryInstance.subCategories).toContain(subCategoryId);
      expect(mockCategoryInstance.save).toHaveBeenCalled();
      expect(result).toEqual(mockCategoryInstance);
    });

    it("should throw error if category not found", async () => {
      Category.findById.mockResolvedValue(null);
      await expect(
        categoryService.addSubCategory("cat1", "sub1")
      ).rejects.toThrow("Category not found");
    });

    it("should throw error if subcategory not found", async () => {
      Category.findById.mockImplementation((id) => {
        if (id === "cat1") return Promise.resolve(mockCategoryInstance);
        return Promise.resolve(null);
      });
      await expect(
        categoryService.addSubCategory("cat1", "sub1")
      ).rejects.toThrow("Subcategory not found");
    });

    it("should throw error if subcategory already exists", async () => {
      mockCategoryInstance.subCategories = ["sub1"];
      const subCategory = { _id: "sub1", name: "Sub Category" };
      Category.findById.mockImplementation((id) => {
        if (id === "cat1") return Promise.resolve(mockCategoryInstance);
        if (id === "sub1") return Promise.resolve(subCategory);
        return Promise.resolve(null);
      });
      await expect(
        categoryService.addSubCategory("cat1", "sub1")
      ).rejects.toThrow("Subcategory already exists in this category");
    });
  });

  describe("removeSubCategory", () => {
    let mockCategoryInstance;

    beforeEach(() => {
      mockCategoryInstance = {
        _id: "cat1",
        name: "Parent Category",
        subCategories: ["sub1"],
        save: jest.fn().mockResolvedValue(this),
      };
    });

    it("should remove a subcategory from a category", async () => {
      const categoryId = "cat1";
      const subCategoryId = "sub1";
      const subCategory = { _id: subCategoryId, name: "Sub Category" };

      Category.findById.mockImplementation((id) => {
        if (id === categoryId) return Promise.resolve(mockCategoryInstance);
        if (id === subCategoryId) return Promise.resolve(subCategory);
        return Promise.resolve(null);
      });

      const result = await categoryService.removeSubCategory(
        categoryId,
        subCategoryId
      );

      expect(Category.findById).toHaveBeenCalledWith(categoryId);
      expect(Category.findById).toHaveBeenCalledWith(subCategoryId);
      expect(mockCategoryInstance.subCategories).not.toContain(subCategoryId);
      expect(mockCategoryInstance.save).toHaveBeenCalled();
      expect(result).toEqual(mockCategoryInstance);
    });

    it("should throw error if category not found", async () => {
      Category.findById.mockResolvedValue(null);
      await expect(
        categoryService.removeSubCategory("cat1", "sub1")
      ).rejects.toThrow("Category not found");
    });

    it("should throw error if subcategory not found", async () => {
      Category.findById.mockImplementation((id) => {
        if (id === "cat1") return Promise.resolve(mockCategoryInstance);
        return Promise.resolve(null);
      });
      await expect(
        categoryService.removeSubCategory("cat1", "sub1")
      ).rejects.toThrow("Subcategory not found");
    });

    it("should throw error if subcategory does not exist in category", async () => {
      mockCategoryInstance.subCategories = ["sub2"]; // sub1 is not in the list
      const subCategory = { _id: "sub1", name: "Sub Category" };
      Category.findById.mockImplementation((id) => {
        if (id === "cat1") return Promise.resolve(mockCategoryInstance);
        if (id === "sub1") return Promise.resolve(subCategory);
        return Promise.resolve(null);
      });
      await expect(
        categoryService.removeSubCategory("cat1", "sub1")
      ).rejects.toThrow("Subcategory does not exist in this category");
    });
  });
});
