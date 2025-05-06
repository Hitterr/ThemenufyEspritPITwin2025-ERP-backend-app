const mongoose = require("mongoose");
const { restaurant1Id } = require("./restaurantSeeds");
const { stock1Id, stock2Id } = require("./stockSeeds");

const consumptionHistories = [
  {
    restaurantId: restaurant1Id,
    stockId: stock1Id,
    qty: 2.5,
    ordreId: new mongoose.Types.ObjectId("65a123abc123abc123abc001"),
    createdAt: new Date("2023-01-15")
  },
  {
    restaurantId: restaurant1Id,
    stockId: stock1Id,
    qty: 32.5,
    ordreId: new mongoose.Types.ObjectId("65a123abc123abc123abc001"),
    createdAt: new Date("2023-04-15")
  },
  {
    restaurantId: restaurant1Id,
    stockId: stock2Id,
    qty: 1.8,
    ordreId: new mongoose.Types.ObjectId("65a123abc123abc123abc002"),
    createdAt: new Date("2023-01-16")
  }
];

module.exports = consumptionHistories;
