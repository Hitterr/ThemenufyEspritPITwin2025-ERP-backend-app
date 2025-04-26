const mongoose = require("mongoose");
const Supplier = require("../models/supplier");
const Invoice = require("../models/invoice");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");

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

const seedData = async () => {
  try {
    // Clear existing data
    await Supplier.deleteMany({});
    await Invoice.deleteMany({});
    console.log("Cleared existing suppliers and invoices");

    // Create test user if not exists
    let testUser = await User.findOne({ email: "test@example.com" });
    if (!testUser) {
      testUser = await new User({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
        role: "admin"
      }).save();
      console.log("Created test user");
    }

    // Create test restaurant if not exists
    let testRestaurant = await Restaurant.findOne({ nameRes: "Test Restaurant" });
    if (!testRestaurant) {
      testRestaurant = await new Restaurant({
        nameRes: "Test Restaurant",
        name: "Test Restaurant",
        contact: {
          email: "restaurant@example.com",
          phone: "+15551234567"
        },
        address: "123 Main St, Toronto, ON, M5V 2H1, Canada",
        taxeTVQ: 9.975,
        taxeTPS: 5,
        cuisineType: "International",
      }).save();
      console.log("Created test restaurant");
    }

    // Create 20 Suppliers with complete data
    const suppliers = [];
    const ingredients = [
      { name: "Tomatoes", category: "Vegetables" },
      { name: "Chicken Breast", category: "Poultry" },
      { name: "Olive Oil", category: "Pantry" },
      { name: "Flour", category: "Baking" },
      { name: "Cheese", category: "Dairy" }
    ];

    for (let i = 1; i <= 20; i++) {
      const supplier = await new Supplier({
        name: `Supplier ${String.fromCharCode(64 + i)}`,
        ingredients: ingredients.map(ing => ({
          ingredientId: new mongoose.Types.ObjectId(),
          name: ing.name,
          category: ing.category,
          price: Math.random() * 50 + 5,
          deliveryTime: Math.floor(Math.random() * 5) + 1
        })),
        contact: { 
          email: `supplier${String.fromCharCode(64 + i)}@example.com`,
          phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          representative: `John ${String.fromCharCode(64 + i)}`
        },
        address: {
          street: `${i}${String.fromCharCode(65 + (i % 5))} Main St`,
          city: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"][i % 5],
          state: ["ON", "BC", "QC", "AB", "ON"][i % 5],
          postalCode: `${i}${i}${i} ${i}${i}${i}`,
          country: "Canada"
        },
        contract: { 
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-12-31"),
          terms: ["NET_30", "NET_60", "COD", "Custom"][Math.floor(Math.random() * 4)],
          minimumOrder: Math.floor(Math.random() * 100) + 50,
          specialConditions: i % 3 === 0 ? "Special discount available" : undefined
        },
        status: ["active", "pending", "suspended", "inactive"][Math.floor(Math.random() * 4)],
        payment: {
          currency: "CAD",
          preferredMethod: ["bank", "credit", "cash"][Math.floor(Math.random() * 3)],
          accountDetails: `Account #${Math.floor(Math.random() * 1000000)}`
        },
        restaurantId: testRestaurant._id,
        notes: i % 4 === 0 ? "Preferred supplier" : undefined
      }).save();
      suppliers.push(supplier);
      console.log(`Created Supplier ${i}: ${supplier.name}`);
    }

    // Create Invoices with correct status values
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
      total: 0, // Will be updated after adding items
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
    const supplierCount = await Supplier.countDocuments();
    const invoiceCount = await Invoice.countDocuments();
    console.log(`Total suppliers: ${supplierCount}`);
    console.log(`Total invoices: ${invoiceCount}`);

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

seedData();