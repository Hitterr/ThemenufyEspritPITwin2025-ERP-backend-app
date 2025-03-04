const mongoose = require("mongoose");
const User = require("./user");

const employeeSchema = new mongoose.Schema({});

// Inherit from User schema
const Admin = User.discriminator("Employee", employeeSchema);

module.exports = Admin;
