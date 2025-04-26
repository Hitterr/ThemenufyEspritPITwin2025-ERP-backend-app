const mongoose = require("mongoose");
const { category1Id, category2Id, category3Id } = require("./categorySeeds");

const ingredient1Id = new mongoose.Types.ObjectId();
const ingredient2Id = new mongoose.Types.ObjectId();
const ingredient3Id = new mongoose.Types.ObjectId();

const ingredients = [
  {
    _id: ingredient1Id,
    libelle: "Mozzarella Cheese",
    quantity: 10,
    type: category1Id,
    price: 12.99,
    disponibility: true,
    maxQty: 20,
    minQty: 5,
    unit: "kg"
  },
  {
    _id: ingredient2Id,
    libelle: "Ground Beef",
    quantity: 15,
    type: category2Id,
    price: 9.99,
    disponibility: true,
    maxQty: 25,
    minQty: 8,
    unit: "kg"
  },
  {
    _id: ingredient3Id,
    libelle: "Tomatoes",
    quantity: 20,
    type: category3Id,
    price: 3.99,
    disponibility: true,
    maxQty: 30,
    minQty: 10,
    unit: "kg"
  }
];

module.exports = {
  ingredients,
  ingredient1Id,
  ingredient2Id,
  ingredient3Id
};