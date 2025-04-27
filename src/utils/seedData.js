const mongoose = require("mongoose");
const Supplier = require("../models/supplier");
const Invoice = require("../models/invoice");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const Ingredient = require("../models/ingredient");
const Category = require("../models/category");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/the-menufy")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Function to generate a random date between two dates
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Function to generate a random delivery time (1 to 10 days)
const addRandomDeliveryDays = (createdAt) => {
  const days = Math.floor(Math.random() * 10) + 1;
  return new Date(createdAt.getTime() + days * 24 * 60 * 60 * 1000);
};

// Function to generate a realistic Canadian postal code
const generatePostalCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const format = `${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${letters[Math.floor(Math.random() * letters.length)]} ${numbers[Math.floor(Math.random() * numbers.length)]}${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}`;
  return format;
};

const seedData = async () => {
  try {
    // Clear existing data
    await Supplier.deleteMany({});
    await Invoice.deleteMany({});
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Ingredient.deleteMany({});
    await Category.deleteMany({});
    console.log("Cleared existing suppliers, invoices, users, restaurants, ingredients, and categories");

    // Create Categories
    const categoryNames = ["Vegetables", "Poultry", "Pantry", "Baking", "Dairy"];
    const categories = [];
    for (const name of categoryNames) {
      const category = await new Category({
        name: name,
      }).save();
      categories.push(category);
      console.log(`Created Category: ${category.name}`);
    }

    // Create Ingredients
    const ingredientData = [
      { libelle: "Tomatoes", type: categories[0]._id, quantity: 100, price: 2.5, maxQty: 500, minQty: 20, unit: "kg" },
      { libelle: "Chicken Breast", type: categories[1]._id, quantity: 50, price: 10, maxQty: 300, minQty: 10, unit: "kg" },
      { libelle: "Olive Oil", type: categories[2]._id, quantity: 200, price: 15, maxQty: 1000, minQty: 50, unit: "l" },
      { libelle: "Flour", type: categories[3]._id, quantity: 300, price: 1.2, maxQty: 2000, minQty: 100, unit: "kg" },
      { libelle: "Cheese", type: categories[4]._id, quantity: 80, price: 8, maxQty: 400, minQty: 30, unit: "kg" },
    ];
    const ingredients = [];
    for (const data of ingredientData) {
      const ingredient = await new Ingredient({
        ...data,
        disponibility: true,
      }).save();
      ingredients.push(ingredient);
      console.log(`Created Ingredient: ${ingredient.libelle}`);
    }

    // Create test user
    const testUser = await new User({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password123", // In a real app, this should be hashed
      role: "admin",
    }).save();
    console.log("Created test user");

    // Create test restaurant
    const testRestaurant = await new Restaurant({
      nameRes: "Test Restaurant",
      name: "Test Restaurant",
      contact: {
        email: "restaurant@example.com",
        phone: "+15551234567",
      },
      address: "123 Main St, Toronto, ON, M5V 2H1, Canada",
      taxeTVQ: 9.975,
      taxeTPS: 5,
      cuisineType: "International",
    }).save();
    console.log("Created test restaurant");

    // Create 20 Suppliers
    const suppliers = [];
    for (let i = 1; i <= 20; i++) {
      const supplier = await new Supplier({
        name: `Supplier ${String.fromCharCode(64 + i)}`,
        ingredients: ingredients.map((ing) => ({
          ingredientId: ing._id,
          pricePerUnit: ing.price * (1 + Math.random() * 0.5), // Price with some variation
          leadTimeDays: Math.floor(Math.random() * 5) + 1,
        })),
        contact: {
          email: `supplier${String.fromCharCode(64 + i).toLowerCase()}@example.com`,
          phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          representative: `John ${String.fromCharCode(64 + i)}`,
        },
        address: {
          street: `${i}${String.fromCharCode(65 + (i % 5))} Main St`,
          city: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"][i % 5],
          state: ["ON", "BC", "QC", "AB", "ON"][i % 5],
          postalCode: generatePostalCode(),
          country: "Canada",
        },
        contract: {
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-12-31"),
          terms: ["NET_30", "NET_60", "COD", "Custom"][Math.floor(Math.random() * 4)],
          minimumOrder: Math.floor(Math.random() * 100) + 50,
          specialConditions: i % 3 === 0 ? "Special discount available" : undefined,
        },
        status: ["active", "pending", "suspended", "inactive"][Math.floor(Math.random() * 4)],
        payment: {
          currency: "CAD",
          preferredMethod: ["bank", "credit", "cash"][Math.floor(Math.random() * 3)],
          accountDetails: `Account #${Math.floor(Math.random() * 1000000)}`,
        },
        restaurantId: testRestaurant._id,
        notes: i % 4 === 0 ? "Preferred supplier" : undefined,
      }).save();
      suppliers.push(supplier);
      console.log(`Created Supplier ${i}: ${supplier.name}`);
    }

    // Create Invoices
    const invoices = [];
    const statuses = ["pending", "delivered", "cancelled"];
    for (const supplier of suppliers) {
      const numInvoices = Math.floor(Math.random() * 6) + 5;
      for (let j = 1; j <= numInvoices; j++) {
        const createdAt = getRandomDate(new Date("2025-01-01"), new Date("2025-12-31"));
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const invoice = new Invoice({
          invoiceNumber: `INV-${supplier.name.replace("Supplier ", "")}-${j}-${createdAt.getFullYear()}`,
          created_by: testUser._id,
          restaurant: testRestaurant._id,
          supplier: supplier._id,
          total: Math.random() * 1000 + 100,
          status: status,
          createdAt: createdAt,
          updatedAt: new Date(),
          deliveredAt: status === "delivered" ? addRandomDeliveryDays(createdAt) : null,
        });
        invoices.push(invoice);
        console.log(`Created Invoice ${invoice.invoiceNumber} with status ${invoice.status}`);
      }
    }

    // Insert all invoices
    await Invoice.insertMany(invoices);
    console.log(`Created ${invoices.length} invoices`);

    // Verification
    const categoryCount = await Category.countDocuments();
    const ingredientCount = await Ingredient.countDocuments();
    const supplierCount = await Supplier.countDocuments();
    const invoiceCount = await Invoice.countDocuments();
    console.log(`Total categories: ${categoryCount}`);
    console.log(`Total ingredients: ${ingredientCount}`);
    console.log(`Total suppliers: ${supplierCount}`);
    console.log(`Total invoices: ${invoiceCount}`);

    // Simulate getDeliveryStats output for verification
    const stats = await Promise.all(
      suppliers.map(async (supplier) => {
        const deliveredInvoices = await Invoice.find({
          supplier: supplier._id,
          status: "delivered",
        });
        const totalInvoices = await Invoice.countDocuments({ supplier: supplier._id });
        const totalDeliveryDays = deliveredInvoices.reduce((sum, inv) => {
          const deliveryTime = (inv.deliveredAt - inv.createdAt) / (1000 * 60 * 60 * 24);
          return sum + deliveryTime;
        }, 0);
        const averageDeliveryTimeDays = deliveredInvoices.length
          ? totalDeliveryDays / deliveredInvoices.length
          : 0;
        return {
          supplierId: supplier._id,
          supplierName: supplier.name,
          averageDeliveryTimeDays: parseFloat(averageDeliveryTimeDays.toFixed(1)),
          invoiceCount: totalInvoices,
        };
      })
    );
    console.log("Simulated getDeliveryStats output:", stats);

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

seedData();