const { restaurant1Id } = require("./restaurantSeeds");
const { supplier1Id } = require("./supplierSeeds");
const { ingredient1Id, ingredient2Id } = require("./ingredientSeeds");
const { invoice1Id, invoice2Id } = require("./invoiceSeeds");

const priceHistories = [
  {
    restaurantId: restaurant1Id,
    supplierId: supplier1Id,
    ingredientId: ingredient1Id,
    invoiceId: invoice1Id,
    price: 11.99,
    createdAt: new Date("2023-01-15")
  },
  {
    restaurantId: restaurant1Id,
    supplierId: supplier1Id,
    ingredientId: ingredient2Id,
    invoiceId: invoice2Id,
    price: 8.99,
    createdAt: new Date("2023-01-16")
  }
];

module.exports = priceHistories;