const mongoose = require("mongoose");

const user1Id = new mongoose.Types.ObjectId();
const user2Id = new mongoose.Types.ObjectId();

const users = [
  {
    _id: user1Id,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "Test@123",
    phone: "5141234567",
    address: "123 Main St, Montreal, QC",
    birthday: "1990-01-15",
    role: "client",
    isEmailVerified: true,
    authProvider: "local",
    verifiedDevices: ["device_123"],
  },
  {
    _id: user2Id,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    password: "Test@123",
    phone: "5149876543",
    address: "456 Oak Ave, Montreal, QC",
    birthday: "1992-05-20",
    role: "client",
    isEmailVerified: true,
    authProvider: "local",
    verifiedDevices: ["device_456"],
  },
];

module.exports = {
  users,
  user1Id,
  user2Id,
};
