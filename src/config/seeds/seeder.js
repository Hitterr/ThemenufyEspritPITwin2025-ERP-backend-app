require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../../models/user");
const Admin = require("../../models/admin");
const users = require("./userSeeds");
const { hashPassword } = require("../../utils/hash");

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Clear existing data
    await User.deleteMany({});
    console.log("Cleared existing users...");

    // Hash passwords and prepare user data
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    // Create admin data
    const adminData = {
      name: "Admin R#1",
      email: "admin.r1@menufy.com",
      password: await hashPassword("admin123"),
      role: "admin",
      restaurantName: "R#1",
      isVerified: true,
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert users and admin
    await User.insertMany(usersWithHashedPasswords);
    await Admin.create(adminData);
    console.log("Users and admin seeded successfully!");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
