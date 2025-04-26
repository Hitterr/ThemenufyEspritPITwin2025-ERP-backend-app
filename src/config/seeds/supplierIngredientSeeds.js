const { ingredient1Id, ingredient2Id, ingredient3Id } = require("./ingredientSeeds");
const { supplier1Id, supplier2Id } = require("./supplierSeeds");

const supplierIngredients = [
  {
    supplierId: supplier1Id,
    ingredientId: ingredient1Id,
    pricePerUnit: 11.99,
    leadTimeDays: 2
  },
  {
    supplierId: supplier2Id,
    ingredientId: ingredient2Id,
    pricePerUnit: 8.99,
    leadTimeDays: 1
  },
  {
    supplierId: supplier1Id,
    ingredientId: ingredient3Id,
    pricePerUnit: 3.49,
    leadTimeDays: 1
  }
];

module.exports = supplierIngredients;