require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../../models/user");
const Admin = require("../../models/admin");
const Employee = require("../../models/employee");
const Restaurant = require("../../models/restaurant");
const SuperAdmin = require("../../models/superAdmin");
const Category = require("../../models/category");
const Ingredient = require("../../models/ingredient");
const SupplierIngredient = require("../../models/supplier");
const Invoice = require("../../models/invoice");
const InvoiceItem = require("../../models/invoiceItem");
// Import seed data
const users = require("./userSeeds");
const admins = require("./adminSeeds");
const { employees } = require("./employeeSeeds");
const { restaurants } = require("./restaurantSeeds");
const superAdmins = require("./superAdminSeeds");
const { hashPassword } = require("../../utils/hash");
// Import new seed data
const { categories } = require("./categorySeeds");
const { ingredients } = require("./ingredientSeeds");
const supplierIngredients = require("./supplierIngredientSeeds");
const { invoices } = require("./invoiceSeeds");
const invoiceItems = require("./invoiceItemSeeds");
// Add new imports
const ConsumptionHistory = require("../../models/ConsumptionHistory");
const PriceHistory = require("../../models/PriceHistory");
// Import new seed data
const consumptionHistories = require("./consumptionHistorySeeds");
const priceHistories = require("./priceHistorySeeds");
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Employee.deleteMany({});
    await Admin.deleteMany({});
    await SuperAdmin.deleteMany({});
    await Category.deleteMany({}); // Add this line
    await Ingredient.deleteMany({}); // Add this line
    await SupplierIngredient.deleteMany({}); // Add this line
    await Invoice.deleteMany({}); // Add this line
    await InvoiceItem.deleteMany({}); // Add this line
    await ConsumptionHistory.deleteMany({}); // Add this line
    await PriceHistory.deleteMany({}); // Add this line
    console.log("Cleared existing data...");
    // Create restaurants first
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log("Restaurants seeded successfully!");
    // Hash passwords and prepare user data
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password),
      }))
    );
    // Create regular users
    await User.insertMany(usersWithHashedPasswords);
    console.log("Users seeded successfully!");
    // Create admins
    const adminsWithHashedPasswords = await Promise.all(
      admins.map(async (admin) => ({
        ...admin,
        password: await hashPassword(admin.password),
      }))
    );
    await Admin.insertMany(adminsWithHashedPasswords);
    console.log("Admins seeded successfully!");
    // Create super admins
    const superAdminsWithHashedPasswords = await Promise.all(
      superAdmins.map(async (superAdmin) => ({
        ...superAdmin,
        password: await hashPassword(superAdmin.password),
      }))
    );
    await SuperAdmin.insertMany(superAdminsWithHashedPasswords);
    console.log("Super admins seeded successfully!");
    // Prepare and create employees with restaurant references
    const employeesWithHashedPasswords = await Promise.all(
      employees.map(async (employee, index) => ({
        ...employee,
        password: await hashPassword(employee.password),
        restaurantFK: createdRestaurants[index % createdRestaurants.length]._id,
      }))
    );
    await Employee.insertMany(employeesWithHashedPasswords);
    console.log("Employees seeded successfully!");
    // Create categories
    await Category.insertMany(categories);
    console.log("Categories seeded successfully!");
    // Create ingredients
    await Ingredient.insertMany(ingredients);
    console.log("Ingredients seeded successfully!");
    // Create supplier ingredients
    // Add to imports
    const Supplier = require("../../models/supplier");
    const { suppliers } = require("./supplierSeeds");
    // Add to clearData section
    await Supplier.deleteMany({});
    // Add before supplier ingredients creation
    // Create suppliers
    await Supplier.insertMany(suppliers);
    console.log("Suppliers seeded successfully!");
    await SupplierIngredient.insertMany(supplierIngredients);
    console.log("Supplier ingredients seeded successfully!");
    // Create invoices
    await Invoice.insertMany(invoices);
    console.log("Invoices seeded successfully!");
    // Create invoice items
    await InvoiceItem.insertMany(invoiceItems);
    console.log("Invoice items seeded successfully!");
    // Add to clearData section
    await ConsumptionHistory.insertMany(consumptionHistories);
    await PriceHistory.insertMany(priceHistories);
    await mongoose.disconnect();
    console.log("Database seeding completed!");
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};
seedDatabase();
