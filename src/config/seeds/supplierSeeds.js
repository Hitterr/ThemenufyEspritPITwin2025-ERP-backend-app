const mongoose = require("mongoose");
const { restaurant1Id, restaurant2Id } = require("./restaurantSeeds");
const { stock1Id, stock2Id, stock3Id } = require("./stockSeeds");

const supplier1Id = new mongoose.Types.ObjectId();
const supplier2Id = new mongoose.Types.ObjectId();
const supplier3Id = new mongoose.Types.ObjectId();

const suppliers = [
  {
    _id: supplier1Id,
    name: "Dairy Supplier Co",
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
    stocks: [
      {
        stockId: stock1Id,
        pricePerUnit: 3.25,
        leadTimeDays: 2
      }
    ],
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
    name: "Meat Masters Inc",
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
    stocks: [
      {
        stockId: stock2Id,
        pricePerUnit: 7.85,
        leadTimeDays: 3
      }
    ],
    status: "active",
    payment: {
      currency: "CAD",
      preferredMethod: "credit",
      accountDetails: "Credit Account: 987654321"
    },
    restaurantId: restaurant2Id,
    notes: "Premium meat supplier"
  },
  {
    _id: supplier3Id,
    name: "GreenVeg Distributors",
    contact: {
      email: "info@greenveg.ca",
      phone: "514-555-0003",
      representative: "Alice Tremblay"
    },
    address: {
      street: "789 Organic Blvd",
      city: "Montreal",
      state: "QC",
      postalCode: "H3C 3C3",
      country: "Canada"
    },
    contract: {
      startDate: new Date("2023-03-01"),
      endDate: new Date("2024-03-01"),
      terms: "COD",
      minimumOrder: 300,
      specialConditions: "Seasonal discounts apply"
    },
    stocks: [
      {
        stockId: stock3Id,
        pricePerUnit: 2.2,
        leadTimeDays: 1
      }
    ],
    status: "pending",
    payment: {
      currency: "CAD",
      preferredMethod: "cash",
      accountDetails: "N/A"
    },
    restaurantId: restaurant1Id,
    notes: "Organic produce supplier under evaluation"
  }
];

module.exports = {
  suppliers,
  supplier1Id,
  supplier2Id,
  supplier3Id
};
