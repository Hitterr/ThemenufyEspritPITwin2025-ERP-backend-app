const mongoose = require("mongoose");
const { restaurant1Id } = require("./restaurantSeeds");
const { supplier1Id, supplier2Id, supplier3Id } = require("./supplierSeeds");
const { employee1Id, employee2Id, employee3Id } = require("./employeeSeeds");

const invoice1Id = new mongoose.Types.ObjectId();
const invoice2Id = new mongoose.Types.ObjectId();
const invoice3Id = new mongoose.Types.ObjectId();
const invoice4Id = new mongoose.Types.ObjectId();
const invoice5Id = new mongoose.Types.ObjectId();
const invoice6Id = new mongoose.Types.ObjectId();
const invoice7Id = new mongoose.Types.ObjectId();
const invoice8Id = new mongoose.Types.ObjectId();

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
    deliveredAt: null,
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
    deliveredAt: new Date("2023-01-18"),
  },
  // Additional invoices
  {
    _id: invoice3Id,
    invoiceNumber: "INV-2023-003",
    created_by: employee2Id,
    restaurant: restaurant1Id,
    supplier: supplier1Id,
    total: 350.5,
    status: "delivered",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-02-03"),
    deliveredAt: new Date("2023-02-03"),
  },
  {
    _id: invoice4Id,
    invoiceNumber: "INV-2023-004",
    created_by: employee2Id,
    restaurant: restaurant1Id,
    supplier: supplier3Id,
    total: 275.25,
    status: "pending",
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2023-02-15"),
    deliveredAt: null,
  },
  {
    _id: invoice5Id,
    invoiceNumber: "INV-2023-005",
    created_by: employee1Id,
    restaurant: restaurant1Id,
    supplier: supplier2Id,
    total: 620.75,
    status: "delivered",
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2023-03-03"),
    deliveredAt: new Date("2023-03-03"),
  },
  {
    _id: invoice6Id,
    invoiceNumber: "INV-2023-006",
    created_by: employee3Id,
    restaurant: restaurant1Id,
    supplier: supplier3Id,
    total: 450.0,
    status: "delivered",
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-17"),
    deliveredAt: new Date("2023-03-17"),
  },
  {
    _id: invoice7Id,
    invoiceNumber: "INV-2023-007",
    created_by: employee1Id,
    restaurant: restaurant1Id,
    supplier: supplier1Id,
    total: 399.99,
    status: "pending",
    createdAt: new Date("2023-04-01"),
    updatedAt: new Date("2023-04-01"),
    deliveredAt: null,
  },
  {
    _id: invoice8Id,
    invoiceNumber: "INV-2023-008",
    created_by: employee2Id,
    restaurant: restaurant1Id,
    supplier: supplier2Id,
    total: 550.5,
    status: "delivered",
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2023-04-17"),
    deliveredAt: new Date("2023-04-17"),
  },
];

module.exports = {
  invoices,
  invoice1Id,
  invoice2Id,
  invoice3Id,
  invoice4Id,
  invoice5Id,
  invoice6Id,
  invoice7Id,
  invoice8Id,
};
