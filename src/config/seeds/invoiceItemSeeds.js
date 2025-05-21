const mongoose = require("mongoose");
const { invoice1Id, invoice2Id, invoice3Id, invoice4Id, invoice5Id, invoice6Id, invoice7Id, invoice8Id } = require("./invoiceSeeds");
const { stock1Id, stock2Id, stock3Id, stock4Id, stock5Id, stock6Id, stock7Id, stock8Id, stock9Id, stock10Id, stock11Id, stock12Id } = require("./stockSeeds");

const invoiceItem1Id = new mongoose.Types.ObjectId();
const invoiceItem2Id = new mongoose.Types.ObjectId();
const invoiceItem3Id = new mongoose.Types.ObjectId();
const invoiceItem4Id = new mongoose.Types.ObjectId();
const invoiceItem5Id = new mongoose.Types.ObjectId();
const invoiceItem6Id = new mongoose.Types.ObjectId();
const invoiceItem7Id = new mongoose.Types.ObjectId();
const invoiceItem8Id = new mongoose.Types.ObjectId();
const invoiceItem9Id = new mongoose.Types.ObjectId();
const invoiceItem10Id = new mongoose.Types.ObjectId();
const invoiceItem11Id = new mongoose.Types.ObjectId();
const invoiceItem12Id = new mongoose.Types.ObjectId();
const invoiceItem13Id = new mongoose.Types.ObjectId();
const invoiceItem14Id = new mongoose.Types.ObjectId();
const invoiceItem15Id = new mongoose.Types.ObjectId();
const invoiceItem16Id = new mongoose.Types.ObjectId();

const invoiceItems = [
  {
    _id: invoiceItem1Id,
    invoice: invoice1Id,
    stock: stock1Id,
    quantity: 10,
    price: 11.99,
    created_at: new Date("2023-01-15")
  },
  {
    _id: invoiceItem2Id,
    invoice: invoice1Id,
    stock: stock2Id,
    quantity: 15,
    price: 8.99,
    created_at: new Date("2023-01-15")
  },
  {
    _id: invoiceItem3Id,
    invoice: invoice2Id,
    stock: stock3Id,
    quantity: 20,
    price: 3.49,
    created_at: new Date("2023-01-16")
  },
  // Additional invoice items
  {
    _id: invoiceItem4Id,
    invoice: invoice2Id,
    stock: stock4Id,
    quantity: 25,
    price: 2.99,
    created_at: new Date("2023-01-16")
  },
  {
    _id: invoiceItem5Id,
    invoice: invoice3Id,
    stock: stock5Id,
    quantity: 15,
    price: 3.49,
    created_at: new Date("2023-02-01")
  },
  {
    _id: invoiceItem6Id,
    invoice: invoice3Id,
    stock: stock6Id,
    quantity: 30,
    price: 7.99,
    created_at: new Date("2023-02-01")
  },
  {
    _id: invoiceItem7Id,
    invoice: invoice4Id,
    stock: stock7Id,
    quantity: 40,
    price: 2.49,
    created_at: new Date("2023-02-15")
  },
  {
    _id: invoiceItem8Id,
    invoice: invoice4Id,
    stock: stock8Id,
    quantity: 10,
    price: 15.99,
    created_at: new Date("2023-02-15")
  },
  {
    _id: invoiceItem9Id,
    invoice: invoice5Id,
    stock: stock9Id,
    quantity: 50,
    price: 4.99,
    created_at: new Date("2023-03-01")
  },
  {
    _id: invoiceItem10Id,
    invoice: invoice5Id,
    stock: stock10Id,
    quantity: 15,
    price: 19.99,
    created_at: new Date("2023-03-01")
  },
  {
    _id: invoiceItem11Id,
    invoice: invoice6Id,
    stock: stock11Id,
    quantity: 35,
    price: 1.99,
    created_at: new Date("2023-03-15")
  },
  {
    _id: invoiceItem12Id,
    invoice: invoice6Id,
    stock: stock12Id,
    quantity: 25,
    price: 12.99,
    created_at: new Date("2023-03-15")
  },
  {
    _id: invoiceItem13Id,
    invoice: invoice7Id,
    stock: stock1Id,
    quantity: 20,
    price: 11.99,
    created_at: new Date("2023-04-01")
  },
  {
    _id: invoiceItem14Id,
    invoice: invoice7Id,
    stock: stock2Id,
    quantity: 15,
    price: 8.99,
    created_at: new Date("2023-04-01")
  },
  {
    _id: invoiceItem15Id,
    invoice: invoice8Id,
    stock: stock3Id,
    quantity: 30,
    price: 3.49,
    created_at: new Date("2023-04-15")
  },
  {
    _id: invoiceItem16Id,
    invoice: invoice8Id,
    stock: stock4Id,
    quantity: 40,
    price: 2.99,
    created_at: new Date("2023-04-15")
  }
];

module.exports = {
  invoiceItems,
  invoiceItem1Id,
  invoiceItem2Id,
  invoiceItem3Id,
  invoiceItem4Id,
  invoiceItem5Id,
  invoiceItem6Id,
  invoiceItem7Id,
  invoiceItem8Id,
  invoiceItem9Id,
  invoiceItem10Id,
  invoiceItem11Id,
  invoiceItem12Id,
  invoiceItem13Id,
  invoiceItem14Id,
  invoiceItem15Id,
  invoiceItem16Id
};