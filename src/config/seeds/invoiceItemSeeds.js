const { invoice1Id, invoice2Id } = require("./invoiceSeeds");
const { stock1Id, stock2Id,stock3Id } = require("./stockSeeds");

const invoiceItems = [
  {
    invoice: invoice1Id,
    stock: stock1Id,
    quantity: 10,
    price: 11.99,
    created_at: new Date("2023-01-15")
  },
  {
    invoice: invoice1Id,
    stock: stock2Id,
    quantity: 15,
    price: 8.99,
    created_at: new Date("2023-01-15")
  },
  {
    invoice: invoice2Id,
    stock: stock3Id,
    quantity: 20,
    price: 3.49,
    created_at: new Date("2023-01-16")
  }
];

module.exports = invoiceItems;