const mongoose = require("mongoose");
const { menuItem1Id, menuItem2Id, menuItem3Id } = require("./menuItemSeeds");

const forecastedSales1Id = new mongoose.Types.ObjectId();
const forecastedSales2Id = new mongoose.Types.ObjectId();
const forecastedSales3Id = new mongoose.Types.ObjectId();

const forecastedSales = [
  {
    _id: forecastedSales1Id,
    menuItemId: menuItem1Id,
    forecastedQty: 50,
    forecastDate: new Date("2023-02-01")
  },
  {
    _id: forecastedSales2Id,
    menuItemId: menuItem2Id,
    forecastedQty: 35,
    forecastDate: new Date("2023-02-01")
  },
  {
    _id: forecastedSales3Id,
    menuItemId: menuItem3Id,
    forecastedQty: 20,
    forecastDate: new Date("2023-02-01")
  }
];

module.exports = {
  forecastedSales,
  forecastedSales1Id,
  forecastedSales2Id,
  forecastedSales3Id
};