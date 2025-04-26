const mongoose = require("mongoose");
const { restaurant1Id } = require("./restaurantSeeds");
const { ingredient1Id, ingredient2Id } = require("./ingredientSeeds");

const consumptionHistories = [
  {
    restaurantId: restaurant1Id,
    ingredientId: ingredient1Id,
    qty: 2.5,
    createdAt: new Date("2023-01-15")
  },
  {
    restaurantId: restaurant1Id,
    ingredientId: ingredient2Id,
    qty: 1.8,
    createdAt: new Date("2023-01-16")
  }
];

module.exports = consumptionHistories;