const mongoose = require("mongoose");

const superAdmin1Id = new mongoose.Types.ObjectId();

const superAdmins = [
  {
    _id: superAdmin1Id,
    firstName: "Super",
    lastName: "Admin",
    email: "superadmin@menufy.com",
    password: "Super@123",
    phone: "5149990000",
    address: "100 Super Admin Blvd, Montreal, QC",
    birthday: "1980-12-25",
    role: "superadmin",
    isEmailVerified: true,
    authProvider: "local",
    verifiedDevices: ["superadmin_device_1"]
  }
];

module.exports = {
  superAdmins,
  superAdmin1Id
};