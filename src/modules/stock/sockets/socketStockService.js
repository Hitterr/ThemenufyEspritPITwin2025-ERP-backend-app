const { getIO } = require("../../../config/socket");

const emitStockAlert = (stock) => {
  const io = getIO();
  io.emit("stock-alert", {
    message: `Low stock alert: ${stock.libelle} is running low! Current quantity: ${stock.quantity} ${stock.unit}`,
    stock: stock,
  });
};

const emitStockUpdate = (stock) => {
  const io = getIO();
  io.emit("stock-update", {
    message: `Stock ${stock.libelle} has been updated`,
    stock: stock,
  });
};

module.exports = {
  emitStockAlert,
  emitStockUpdate,
};
