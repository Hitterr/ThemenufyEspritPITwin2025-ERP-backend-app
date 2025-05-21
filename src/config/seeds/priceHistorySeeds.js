const mongoose = require("mongoose");
const {
  restaurant1Id,
  restaurant2Id,
  restaurant3Id,
} = require("./restaurantSeeds");
const { supplier1Id, supplier2Id, supplier3Id } = require("./supplierSeeds");
const {
  stock1Id,
  stock2Id,
  stock3Id,
  stock4Id,
  stock5Id,
  stock6Id,
} = require("./stockSeeds");
const {
  invoice1Id,
  invoice2Id,
  invoice3Id,
  invoice4Id,
  invoice5Id,
  invoice6Id,
  invoice7Id,
  invoice8Id,
} = require("./invoiceSeeds");

const priceHistory1Id = new mongoose.Types.ObjectId();
const priceHistory2Id = new mongoose.Types.ObjectId();
const priceHistory3Id = new mongoose.Types.ObjectId();
const priceHistory4Id = new mongoose.Types.ObjectId();
const priceHistory5Id = new mongoose.Types.ObjectId();
const priceHistory6Id = new mongoose.Types.ObjectId();
const priceHistory7Id = new mongoose.Types.ObjectId();
const priceHistory8Id = new mongoose.Types.ObjectId();
const priceHistory9Id = new mongoose.Types.ObjectId();
const priceHistory10Id = new mongoose.Types.ObjectId();
const priceHistory11Id = new mongoose.Types.ObjectId();
const priceHistory12Id = new mongoose.Types.ObjectId();
const priceHistory13Id = new mongoose.Types.ObjectId();
const priceHistory14Id = new mongoose.Types.ObjectId();
const priceHistory15Id = new mongoose.Types.ObjectId();

const priceHistories = [
  {
    _id: priceHistory1Id,
    restaurantId: restaurant1Id,
    supplierId: supplier1Id,
    stockId: stock1Id,
    invoiceId: invoice1Id,
    price: 11.99,
    createdAt: new Date("2023-01-15"),
  },
  {
    _id: priceHistory2Id,
    restaurantId: restaurant1Id,
    supplierId: supplier1Id,
    stockId: stock2Id,
    invoiceId: invoice2Id,
    price: 8.99,
    createdAt: new Date("2023-01-16"),
  },
  // Additional price history records
  {
    _id: priceHistory3Id,
    restaurantId: restaurant1Id,
    supplierId: supplier1Id,
    stockId: stock1Id,
    invoiceId: invoice1Id,
    price: 12.49,
    createdAt: new Date("2023-02-01"),
  },
  {
    _id: priceHistory4Id,
    restaurantId: restaurant1Id,
    supplierId: supplier2Id,
    stockId: stock2Id,
    invoiceId: invoice2Id,
    price: 9.25,
    createdAt: new Date("2023-02-15"),
  },
  {
    _id: priceHistory5Id,
    restaurantId: restaurant1Id,
    supplierId: supplier1Id,
    stockId: stock3Id,
    invoiceId: invoice3Id,
    price: 3.75,
    createdAt: new Date("2023-02-20"),
  },
  {
    _id: priceHistory6Id,
    restaurantId: restaurant1Id,
    supplierId: supplier3Id,
    stockId: stock4Id,
    invoiceId: invoice4Id,
    price: 3.15,
    createdAt: new Date("2023-03-01"),
  },
  {
    _id: priceHistory7Id,
    restaurantId: restaurant1Id,
    supplierId: supplier2Id,
    stockId: stock5Id,
    invoiceId: invoice5Id,
    price: 3.65,
    createdAt: new Date("2023-03-10"),
  },
  {
    _id: priceHistory8Id,
    restaurantId: restaurant1Id,
    supplierId: supplier3Id,
    stockId: stock6Id,
    invoiceId: invoice6Id,
    price: 8.25,
    createdAt: new Date("2023-03-20"),
  },
  {
    _id: priceHistory9Id,
    restaurantId: restaurant1Id,
    supplierId: supplier1Id,
    stockId: stock1Id,
    invoiceId: invoice7Id,
    price: 12.99,
    createdAt: new Date("2023-04-01"),
  },
  {
    _id: priceHistory10Id,
    restaurantId: restaurant1Id,
    supplierId: supplier2Id,
    stockId: stock2Id,
    invoiceId: invoice8Id,
    price: 9.49,
    createdAt: new Date("2023-04-15"),
  },
  {
    _id: priceHistory11Id,
    restaurantId: restaurant1Id,
    supplierId: supplier1Id,
    stockId: stock1Id,
    invoiceId: invoice1Id,
    price: 13.25,
    createdAt: new Date("2023-05-01"),
  },
  {
    _id: priceHistory12Id,
    restaurantId: restaurant1Id,
    supplierId: supplier2Id,
    stockId: stock3Id,
    invoiceId: invoice3Id,
    price: 3.99,
    createdAt: new Date("2023-05-15"),
  },
  {
    _id: priceHistory13Id,
    restaurantId: restaurant1Id,
    supplierId: supplier3Id,
    stockId: stock4Id,
    invoiceId: invoice4Id,
    price: 3.25,
    createdAt: new Date("2023-06-01"),
  },
  {
    _id: priceHistory14Id,
    restaurantId: restaurant1Id,
    supplierId: supplier1Id,
    stockId: stock5Id,
    invoiceId: invoice5Id,
    price: 3.85,
    createdAt: new Date("2023-06-15"),
  },
  {
    _id: priceHistory15Id,
    restaurantId: restaurant1Id,
    supplierId: supplier2Id,
    stockId: stock6Id,
    invoiceId: invoice6Id,
    price: 8.49,
    createdAt: new Date("2023-07-01"),
  },
];

module.exports = {
  priceHistories,
  priceHistory1Id,
  priceHistory2Id,
  priceHistory3Id,
  priceHistory4Id,
  priceHistory5Id,
  priceHistory6Id,
  priceHistory7Id,
  priceHistory8Id,
  priceHistory9Id,
  priceHistory10Id,
  priceHistory11Id,
  priceHistory12Id,
  priceHistory13Id,
  priceHistory14Id,
  priceHistory15Id,
};
