const mongoose = require("mongoose");
const { restaurant1Id, restaurant2Id } = require("./restaurantSeeds");

const supplier1Id = new mongoose.Types.ObjectId();
const supplier2Id = new mongoose.Types.ObjectId();
const supplier3Id = new mongoose.Types.ObjectId();

const suppliers = [
  {
    _id: supplier1Id,
    name: "Dairy Supplier Co.",
    contact: {
      email: "contact@dairysupplier.com",
      phone: "514-555-0001",
      representative: "John Smith"
    },
    address: {
      street: "123 Supplier Street",
      city: "Montreal",
      state: "QC",
      postalCode: "H1A 1A1",
      country: "Canada"
    },
    contract: {
      startDate: new Date("2023-01-01"),
      endDate: new Date("2024-01-01"),
      terms: "NET_30",
      minimumOrder: 500,
      specialConditions: "Free delivery for orders over $1000"
    },
    status: "active",
    payment: {
      currency: "CAD",
      preferredMethod: "bank",
      accountDetails: "Bank Account: 123456789"
    },
    restaurantId: restaurant1Id,
    notes: "Reliable dairy supplier"
  },
  {
    _id: supplier2Id,
    name: "Meat Masters Inc.",
    contact: {
      email: "orders@meatmasters.com",
      phone: "514-555-0002",
      representative: "Mary Johnson"
    },
    address: {
      street: "456 Butcher Avenue",
      city: "Montreal",
      state: "QC",
      postalCode: "H2B 2B2",
      country: "Canada"
    },
    contract: {
      startDate: new Date("2023-01-01"),
      endDate: new Date("2024-01-01"),
      terms: "NET_60",
      minimumOrder: 1000,
      specialConditions: "48-hour advance notice required"
    },
    status: "active",
    payment: {
      currency: "CAD",
      preferredMethod: "credit",
      accountDetails: "Credit Account: 987654321"
    },
    restaurantId: restaurant2Id,
    notes: "Premium meat supplier"
  }
];

module.exports = {
  suppliers,
  supplier1Id,
  supplier2Id,
  supplier3Id
};