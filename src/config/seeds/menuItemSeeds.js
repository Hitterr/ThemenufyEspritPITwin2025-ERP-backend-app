const mongoose = require("mongoose");
const { stock1Id, stock2Id, stock3Id } = require("./stockSeeds");

const menuItem1Id = new mongoose.Types.ObjectId();
const menuItem2Id = new mongoose.Types.ObjectId();
const menuItem3Id = new mongoose.Types.ObjectId();

const menuItems = [
  {
    _id: menuItem1Id,
    name: "Cheese Pizza",
    description: "Classic cheese pizza with mozzarella",
    price: 12.99,
    stocks: [
      {
        stockId: stock1Id,
        quantity: 0.2
      },
      {
        stockId: stock2Id,
        quantity: 0.1
      }
    ]
  },
  {
    _id: menuItem2Id,
    name: "Beef Burger",
    description: "Juicy beef burger with fresh toppings",
    price: 9.99,
    stocks: [
      {
        stockId: stock2Id,
        quantity: 0.25
      }
    ]
  },
  {
    _id: menuItem3Id,
    name: "Tomato Salad",
    description: "Fresh tomato salad with herbs",
    price: 7.99,
    stocks: [
      {
        stockId: stock3Id,
        quantity: 0.3
      }
    ]
  }
];

module.exports = {
  menuItems,
  menuItem1Id,
  menuItem2Id,
  menuItem3Id
};