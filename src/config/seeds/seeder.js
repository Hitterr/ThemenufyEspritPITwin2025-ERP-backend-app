require("dotenv").config();
const mongoose = require("mongoose");

// Models
const User = require("../../models/user");
const Admin = require("../../models/admin");
const Employee = require("../../models/employee");
const Restaurant = require("../../models/restaurant");
const SuperAdmin = require("../../models/superAdmin");
const Category = require("../../models/category");
const Stock = require("../../models/stock"); 
const Ingredient = require("../../models/ingredient");
const Invoice = require("../../models/invoice");
const InvoiceItem = require("../../models/invoiceItem");
const ConsumptionHistory = require("../../models/ConsumptionHistory");
const PriceHistory = require("../../models/PriceHistory");
const Supplier = require("../../models/supplier");
const SupplierIngredient = require("../../models/supplierIngredient");

// Seeds
const { users } = require("./userSeeds");
const { admins } = require("./adminSeeds");
const { employees } = require("./employeeSeeds");
const { restaurants } = require("./restaurantSeeds");
const { superAdmins } = require("./superAdminSeeds");
const { categories } = require("./categorySeeds");
const { stocks } = require("./stockSeeds");
const { ingredients } = require("./ingredientSeeds");
const { invoices } = require("./invoiceSeeds");
const { invoiceItems } = require("./invoiceItemSeeds");
const { consumptionHistories } = require("./consumptionHistorySeeds");
const { priceHistories } = require("./priceHistorySeeds");
const { suppliers } = require("./supplierSeeds");

const { hashPassword } = require("../../utils/hash");

const checkIfDbEmpty = async () => {
  // Check if any of the main collections have data
  const restaurantCount = await Restaurant.countDocuments();
  const userCount = await User.countDocuments();
  const adminCount = await Admin.countDocuments();
  
  // If any of these collections have data, consider the DB not empty
  return restaurantCount === 0 && userCount === 0 && adminCount === 0;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Check if database is empty before seeding
    const isEmpty = await checkIfDbEmpty();
    
    if (!isEmpty) {
      console.log("Database already has data. Skipping seed operation.");
      await mongoose.disconnect();
      process.exit(0);
      return;
    }
    
    console.log("Database is empty. Starting seed operation...");

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Employee.deleteMany({});
    await Admin.deleteMany({});
    await SuperAdmin.deleteMany({});
    await Category.deleteMany({});
    await Stock.deleteMany({}); 
    await Ingredient.deleteMany({});
    await Invoice.deleteMany({});
    await InvoiceItem.deleteMany({});
    await ConsumptionHistory.deleteMany({});
    await PriceHistory.deleteMany({});
    await Supplier.deleteMany({});
    await SupplierIngredient.deleteMany({});

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
    await User.insertMany(usersWithHashedPasswords);
    console.log("Users seeded successfully!");

    const adminsWithHashedPasswords = await Promise.all(
      admins.map(async (admin) => ({
        ...admin,
        password: await hashPassword(admin.password),
      }))
    );
    await Admin.insertMany(adminsWithHashedPasswords);
    console.log("Admins seeded successfully!");

    const superAdminsWithHashedPasswords = await Promise.all(
      superAdmins.map(async (superAdmin) => ({
        ...superAdmin,
        password: await hashPassword(superAdmin.password),
      }))
    );
    await SuperAdmin.insertMany(superAdminsWithHashedPasswords);
    console.log("Super admins seeded successfully!");

    const employeesWithHashedPasswords = await Promise.all(
      employees.map(async (employee, index) => ({
        ...employee,
        password: await hashPassword(employee.password),
        restaurantFK: createdRestaurants[index % createdRestaurants.length]._id,
      }))
    );
    await Employee.insertMany(employeesWithHashedPasswords);
    console.log("Employees seeded successfully!");

    await Category.insertMany(categories);
    console.log("Categories seeded successfully!");

    await Stock.insertMany(stocks);
    console.log("Stocks seeded successfully!");

    await Ingredient.insertMany(ingredients);
    console.log("Ingredients seeded successfully!");

    await Supplier.insertMany(suppliers);
    console.log("Suppliers seeded successfully!");

    //await SupplierIngredient.insertMany(supplierIngredients);
    //console.log("Supplier ingredients seeded successfully!");

    await Invoice.insertMany(invoices);
    console.log("Invoices seeded successfully!");

    await InvoiceItem.insertMany(invoiceItems);
    console.log("Invoice items seeded successfully!");

    await ConsumptionHistory.insertMany(consumptionHistories);
    console.log("Consumption history seeded successfully!");

    await PriceHistory.insertMany(priceHistories);
    console.log("Price history seeded successfully!");

    await mongoose.disconnect();
    console.log("Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
