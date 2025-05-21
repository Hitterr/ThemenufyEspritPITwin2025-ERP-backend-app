const mongoose = require("mongoose");

const restaurant1Id = new mongoose.Types.ObjectId();
const restaurant2Id = new mongoose.Types.ObjectId();
const restaurant3Id = new mongoose.Types.ObjectId();

const restaurants = [
  {
    _id: restaurant1Id,
    nameRes: "Restaurant One",
    phone: "5141234567",
    address: "123 Main St, Montreal, QC",
    cuisineType: "International",
    taxeTPS: 5,
    taxeTVQ: 9.975,
    payCashMethod: true,
  },
  {
    _id: restaurant2Id,
    nameRes: "Restaurant Two",
    phone: "5149876543",
    address: "456 Oak Ave, Montreal, QC",
    cuisineType: "French",
    taxeTPS: 5,
    taxeTVQ: 9.975,
    payCashMethod: false,
  },
  {
    _id: restaurant3Id,
    nameRes: "Restaurant Three",
    phone: "5142223333",
    address: "789 Pine St, Montreal, QC",
    cuisineType: "Asian",
    taxeTPS: 5,
    taxeTVQ: 9.975,
    payCashMethod: true,
  }
];

module.exports = {
  restaurants,
  restaurant1Id,
  restaurant2Id,
  restaurant3Id
};
