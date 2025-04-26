const { invoice1Id, invoice2Id } = require("./invoiceSeeds");
const { ingredient1Id, ingredient2Id, ingredient3Id } = require("./ingredientSeeds");

const invoiceItems = [
  {
    invoice: invoice1Id,
    ingredient: ingredient1Id,
    quantity: 10,
    price: 11.99,
    created_at: new Date("2023-01-15")
  },
  {
    invoice: invoice1Id,
    ingredient: ingredient2Id,
    quantity: 15,
    price: 8.99,
    created_at: new Date("2023-01-15")
  },
  {
    invoice: invoice2Id,
    ingredient: ingredient3Id,
    quantity: 20,
    price: 3.49,
    created_at: new Date("2023-01-16")
  }
];

module.exports = invoiceItems;