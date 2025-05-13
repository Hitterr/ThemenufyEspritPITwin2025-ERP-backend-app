const categoryController = require("../category.controller");
const categoryService = require("../../services/category.service");

// Mock the category service
jest.mock("../../services/category.service");

describe("Category Controller", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("createCategory", () => {
    it("should create a category and return 201 status", async () => {
      const newCategory = {
        name: "Test Category",
        description: "Test Description",
      };
      mockReq.body = newCategory;
      categoryService.createCategory.mockResolvedValue(newCategory);

      await categoryController.createCategory(mockReq, mockRes);

      expect(categoryService.createCategory).toHaveBeenCalledWith(newCategory);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(newCategory);
    });

    it("should return 400 if category creation fails", async () => {
      const errorMessage = "Creation failed";
      mockReq.body = { name: "Test Category" };
      categoryService.createCategory.mockRejectedValue(new Error(errorMessage));

      await categoryController.createCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("getCategories", () => {
    it("should get categories with pagination and return 200 status", async () => {
      const categories = [{ name: "Category 1" }, { name: "Category 2" }];
      const paginationResult = {
        categories,
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
      };
      mockReq.query = { page: "1", limit: "10" };
      categoryService.getCategories.mockResolvedValue(paginationResult);

      await categoryController.getCategories(mockReq, mockRes);

      expect(categoryService.getCategories).toHaveBeenCalledWith(1, 10);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: categories,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
          limit: 10,
        },
      });
    });

    it("should return 500 if getting categories fails", async () => {
      const errorMessage = "Failed to fetch";
      categoryService.getCategories.mockRejectedValue(new Error(errorMessage));

      await categoryController.getCategories(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("getCategoryById", () => {
    it("should get a category by ID and return 200 status", async () => {
      const category = { _id: "1", name: "Test Category" };
      mockReq.params.id = "1";
      categoryService.getCategoryById.mockResolvedValue(category);

      await categoryController.getCategoryById(mockReq, mockRes);

      expect(categoryService.getCategoryById).toHaveBeenCalledWith("1");
      expect(mockRes.json).toHaveBeenCalledWith(category);
    });

    it("should return 404 if category not found", async () => {
      mockReq.params.id = "1";
      categoryService.getCategoryById.mockResolvedValue(null);

      await categoryController.getCategoryById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Category not found",
      });
    });

    it("should return 500 if getting category by ID fails", async () => {
      const errorMessage = "Failed to fetch by ID";
      mockReq.params.id = "1";
      categoryService.getCategoryById.mockRejectedValue(
        new Error(errorMessage)
      );

      await categoryController.getCategoryById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("updateCategory", () => {
    it("should update a category and return 200 status", async () => {
      const updatedCategory = { _id: "1", name: "Updated Category" };
      mockReq.params.id = "1";
      mockReq.body = { name: "Updated Category" };
      categoryService.updateCategory.mockResolvedValue(updatedCategory);

      await categoryController.updateCategory(mockReq, mockRes);

      expect(categoryService.updateCategory).toHaveBeenCalledWith("1", {
        name: "Updated Category",
      });
      expect(mockRes.json).toHaveBeenCalledWith(updatedCategory);
    });

    it("should return 404 if category to update not found", async () => {
      mockReq.params.id = "1";
      mockReq.body = { name: "Updated Category" };
      categoryService.updateCategory.mockResolvedValue(null);

      await categoryController.updateCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Category not found",
      });
    });

    it("should return 400 if updating category fails", async () => {
      const errorMessage = "Update failed";
      mockReq.params.id = "1";
      mockReq.body = { name: "Updated Category" };
      categoryService.updateCategory.mockRejectedValue(new Error(errorMessage));

      await categoryController.updateCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("deleteCategory", () => {
    it("should delete a category and return 200 status", async () => {
      mockReq.params.id = "1";
      categoryService.deleteCategory.mockResolvedValue({ _id: "1" }); // Mock a truthy value for successful deletion

      await categoryController.deleteCategory(mockReq, mockRes);

      expect(categoryService.deleteCategory).toHaveBeenCalledWith("1");
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Category deleted",
      });
    });

    it("should return 404 if category to delete not found", async () => {
      mockReq.params.id = "1";
      categoryService.deleteCategory.mockResolvedValue(null);

      await categoryController.deleteCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Category not found",
      });
    });

    it("should return 500 if deleting category fails", async () => {
      const errorMessage = "Deletion failed";
      mockReq.params.id = "1";
      categoryService.deleteCategory.mockRejectedValue(new Error(errorMessage));

      await categoryController.deleteCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("addSubCategory", () => {
    it("should add a subcategory and return 200 status", async () => {
      const categoryId = "cat1";
      const subCategoryId = "sub1";
      const updatedCategory = {
        _id: categoryId,
        subCategories: [subCategoryId],
      };
      mockReq.body = { categoryId, subCategoryId };
      categoryService.addSubCategory.mockResolvedValue(updatedCategory);

      await categoryController.addSubCategory(mockReq, mockRes);

      expect(categoryService.addSubCategory).toHaveBeenCalledWith(
        categoryId,
        subCategoryId
      );
      expect(mockRes.json).toHaveBeenCalledWith(updatedCategory);
    });

    it("should create a subcategory if name and description provided, then add it", async () => {
      const categoryId = "cat1";
      const newSubCategoryData = { name: "New Sub", description: "Desc" };
      const createdSubCategory = { _id: "newSubId", ...newSubCategoryData };
      const updatedCategory = {
        _id: categoryId,
        subCategories: [createdSubCategory._id],
      };

      mockReq.body = {
        categoryId,
        name: newSubCategoryData.name,
        description: newSubCategoryData.description,
      };

      categoryService.createCategory.mockResolvedValue(createdSubCategory);
      categoryService.addSubCategory.mockResolvedValue(updatedCategory);

      await categoryController.addSubCategory(mockReq, mockRes);

      expect(categoryService.createCategory).toHaveBeenCalledWith(
        newSubCategoryData
      );
      expect(categoryService.addSubCategory).toHaveBeenCalledWith(
        categoryId,
        createdSubCategory._id
      );
      expect(mockRes.json).toHaveBeenCalledWith(updatedCategory);
    });

    it("should return 404 if category not found when adding subcategory", async () => {
      mockReq.body = { categoryId: "cat1", subCategoryId: "sub1" };
      categoryService.addSubCategory.mockResolvedValue(null);

      await categoryController.addSubCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Category not found",
      });
    });

    it("should return 400 if adding subcategory fails", async () => {
      const errorMessage = "Add subcategory failed";
      mockReq.body = { categoryId: "cat1", subCategoryId: "sub1" };
      categoryService.addSubCategory.mockRejectedValue(new Error(errorMessage));

      await categoryController.addSubCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("removeSubCategory", () => {
    it("should remove a subcategory and return 200 status", async () => {
      const categoryId = "cat1";
      const subCategoryId = "sub1";
      const updatedCategory = { _id: categoryId, subCategories: [] };
      mockReq.body = { categoryId, subCategoryId };
      categoryService.removeSubCategory.mockResolvedValue(updatedCategory);

      await categoryController.removeSubCategory(mockReq, mockRes);

      expect(categoryService.removeSubCategory).toHaveBeenCalledWith(
        categoryId,
        subCategoryId
      );
      expect(mockRes.json).toHaveBeenCalledWith(updatedCategory);
    });

    it("should return 404 if category not found when removing subcategory", async () => {
      mockReq.body = { categoryId: "cat1", subCategoryId: "sub1" };
      categoryService.removeSubCategory.mockResolvedValue(null);

      await categoryController.removeSubCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Category not found",
      });
    });

    it("should return 400 if removing subcategory fails", async () => {
      const errorMessage = "Remove subcategory failed";
      mockReq.body = { categoryId: "cat1", subCategoryId: "sub1" };
      categoryService.removeSubCategory.mockRejectedValue(
        new Error(errorMessage)
      );

      await categoryController.removeSubCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
