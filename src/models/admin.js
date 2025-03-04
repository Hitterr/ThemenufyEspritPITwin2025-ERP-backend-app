const mongoose = require("mongoose");
const User = require("./user");

const adminSchema = new mongoose.Schema({});

// Inherit from User schema
const Admin = User.discriminator("Admin", adminSchema);

module.exports = Admin;
