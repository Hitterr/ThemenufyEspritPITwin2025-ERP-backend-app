const mongoose = require("mongoose");
const { restaurant1Id, restaurant2Id } = require("./restaurantSeeds");
const { stock1Id, stock2Id, stock3Id } = require("./stockSeeds");

const consumptionHistory1Id = new mongoose.Types.ObjectId();
const consumptionHistory2Id = new mongoose.Types.ObjectId();
const consumptionHistory3Id = new mongoose.Types.ObjectId();
const consumptionHistory4Id = new mongoose.Types.ObjectId();
const consumptionHistory5Id = new mongoose.Types.ObjectId();
const consumptionHistory6Id = new mongoose.Types.ObjectId();
const consumptionHistory7Id = new mongoose.Types.ObjectId();
const consumptionHistory8Id = new mongoose.Types.ObjectId();
const consumptionHistory9Id = new mongoose.Types.ObjectId();
const consumptionHistory10Id = new mongoose.Types.ObjectId();

const orderId1 = new mongoose.Types.ObjectId();
const orderId2 = new mongoose.Types.ObjectId();
const orderId3 = new mongoose.Types.ObjectId();
const orderId4 = new mongoose.Types.ObjectId();

const consumptionHistories = [
  {
    _id: consumptionHistory1Id,
    restaurantId: restaurant1Id,
    stockId: stock1Id,
    qty: 2.5,
    ordreId: orderId1,
    createdAt: new Date("2023-01-15"),
  },
  {
    _id: consumptionHistory2Id,
    restaurantId: restaurant1Id,
    stockId: stock1Id,
    qty: 32.5,
    ordreId: orderId1,
    createdAt: new Date("2023-04-15"),
  },
  {
    _id: consumptionHistory3Id,
    restaurantId: restaurant1Id,
    stockId: stock2Id,
    qty: 1.8,
    ordreId: orderId2,
    createdAt: new Date("2023-01-16"),
  },
  // Additional consumption history records
  {
    _id: consumptionHistory4Id,
    restaurantId: restaurant1Id,
    stockId: stock1Id,
    qty: 5.0,
    ordreId: orderId2,
    createdAt: new Date("2023-02-10"),
  },
  {
    _id: consumptionHistory5Id,
    restaurantId: restaurant1Id,
    stockId: stock2Id,
    qty: 3.2,
    ordreId: orderId3,
    createdAt: new Date("2023-02-15"),
  },
  {
    _id: consumptionHistory6Id,
    restaurantId: restaurant1Id,
    stockId: stock3Id,
    qty: 7.5,
    ordreId: orderId3,
    createdAt: new Date("2023-03-01"),
  },
  {
    _id: consumptionHistory7Id,
    restaurantId: restaurant1Id,
    stockId: stock1Id,
    qty: 4.2,
    ordreId: orderId3,
    createdAt: new Date("2023-03-15"),
  },
  {
    _id: consumptionHistory8Id,
    restaurantId: restaurant1Id,
    stockId: stock3Id,
    qty: 6.8,
    ordreId: orderId4,
    createdAt: new Date("2023-04-01"),
  },
  {
    _id: consumptionHistory9Id,
    restaurantId: restaurant1Id,
    stockId: stock2Id,
    qty: 2.3,
    ordreId: orderId4,
    createdAt: new Date("2023-04-10"),
  },
  {
    _id: consumptionHistory10Id,
    restaurantId: restaurant1Id,
    stockId: stock3Id,
    qty: 8.1,
    ordreId: orderId4,
    createdAt: new Date("2023-05-01"),
  },
];

module.exports = {
  consumptionHistories,
  consumptionHistory1Id,
  consumptionHistory2Id,
  consumptionHistory3Id,
  consumptionHistory4Id,
  consumptionHistory5Id,
  consumptionHistory6Id,
  consumptionHistory7Id,
  consumptionHistory8Id,
  consumptionHistory9Id,
  consumptionHistory10Id,
  orderId1,
  orderId2,
  orderId3,
  orderId4,
};
