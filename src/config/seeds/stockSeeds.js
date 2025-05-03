// seeds/stockSeeds.js
const mongoose = require("mongoose");
const { restaurant1Id, restaurant2Id } = require("./restaurantSeeds");
const { category1Id, category2Id, category3Id } = require("./categorySeeds");

const stock1Id = new mongoose.Types.ObjectId();
const stock2Id = new mongoose.Types.ObjectId();
const stock3Id = new mongoose.Types.ObjectId();

const stocks = [
  {
    _id: stock1Id,
    libelle: "Milk",
    quantity: 100,
    price: 3.5,
    type: category1Id,
    maxQty: 200,
    minQty: 20,
    unit: "l",
    restaurant: restaurant1Id
  },
  {
    _id: stock2Id,
    libelle: "Beef",
    quantity: 50,
    price: 6.2,
    type: category2Id,
    maxQty: 150,
    minQty: 10,
    unit: "kg",
    restaurant: restaurant2Id
  },
  {
    _id: stock3Id,
    libelle: "Spinach",
    quantity: 75,
    price: 2.1,
    type: category3Id,
    maxQty: 120,
    minQty: 15,
    unit: "kg",
    restaurant: restaurant1Id
  }
];

module.exports = {
  stocks,
  stock1Id,
  stock2Id,
  stock3Id
};
