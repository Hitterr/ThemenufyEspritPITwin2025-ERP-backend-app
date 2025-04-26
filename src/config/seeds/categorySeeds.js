const mongoose = require("mongoose");

const category1Id = new mongoose.Types.ObjectId();
const category2Id = new mongoose.Types.ObjectId();
const category3Id = new mongoose.Types.ObjectId();

const categories = [
  {
    _id: category1Id,
    name: "Dairy Products",
    description: "Milk, cheese, and other dairy products"
  },
  {
    _id: category2Id,
    name: "Meat",
    description: "Fresh and frozen meat products"
  },
  {
    _id: category3Id,
    name: "Produce",
    description: "Fresh fruits and vegetables"
  }
];

module.exports = {
  categories,
  category1Id,
  category2Id,
  category3Id
};