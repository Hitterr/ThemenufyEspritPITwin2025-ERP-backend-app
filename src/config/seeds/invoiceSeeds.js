const mongoose = require("mongoose");
const { restaurant1Id } = require("./restaurantSeeds");
const { supplier1Id, supplier2Id } = require("./supplierSeeds");
const { employee1Id } = require("./employeeSeeds");

const invoice1Id = new mongoose.Types.ObjectId();
const invoice2Id = new mongoose.Types.ObjectId();

const invoices = [
  {
    _id: invoice1Id,
    invoiceNumber: "INV-2023-001",
    created_by: employee1Id,
    restaurant: restaurant1Id,
    supplier: supplier1Id,
    total: 299.99,
    status: "pending",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
    deliveredAt: null
  },
  {
    _id: invoice2Id,
    invoiceNumber: "INV-2023-002",
    created_by: employee1Id,
    restaurant: restaurant1Id,
    supplier: supplier2Id,
    total: 499.99,
    status: "delivered",
    createdAt: new Date("2023-01-16"),
    updatedAt: new Date("2023-01-18"),
    deliveredAt: new Date("2023-01-18")
  }
];

module.exports = {
  invoices,
  invoice1Id,
  invoice2Id
};