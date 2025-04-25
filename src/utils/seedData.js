const mongoose = require("mongoose");
const Supplier = require("../models/supplier");
const Invoice = require("../models/invoice");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/the-menufy", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Function to generate a random date between two dates
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Function to generate a random delivery time (1 to 10 days)
const addRandomDeliveryDays = (createdAt) => {
  const days = Math.floor(Math.random() * 10) + 1; // Random 1 to 10 days
  return new Date(createdAt.getTime() + days * 24 * 60 * 60 * 1000);
};

const seedData = async () => {
  try {
    // Clear existing data
    await Supplier.deleteMany({});
    await Invoice.deleteMany({});
    console.log("Cleared existing suppliers and invoices");

    // Create 20 Suppliers
    const suppliers = [];
    for (let i = 1; i <= 20; i++) {
      const supplier = await new Supplier({
        name: `Supplier ${String.fromCharCode(64 + i)}`, // Supplier A, B, C, ..., T
        contact: { email: `supplier${String.fromCharCode(64 + i)}@example.com` },
        contract: { startDate: new Date("2025-01-01") },
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }).save();
      suppliers.push(supplier);
      console.log(`Created Supplier ${i}: ${supplier.name} (ID: ${supplier._id})`);
    }

    // Create Invoices for each supplier
    const statuses = ["paid", "pending"];
    const invoices = [];

    for (const supplier of suppliers) {
      const numInvoices = Math.floor(Math.random() * 6) + 5; // Randomly 5 to 10 invoices per supplier
      for (let j = 1; j <= numInvoices; j++) {
        const createdAt = getRandomDate(new Date("2025-01-01"), new Date("2025-12-31")); // Full 2025 range
        const deliveredAt = addRandomDeliveryDays(createdAt); // Ensure deliveredAt is set
        const invoice = {
          invoiceNumber: `INV-${supplier.name.replace("Supplier ", "")}${j}`,
          created_by: new mongoose.Types.ObjectId(), // Random ObjectID (adjust if needed)
          restaurant: new mongoose.Types.ObjectId(), // Random ObjectID (adjust if needed)
          supplier: supplier._id, // Correct reference to supplier
          total: Math.random() * 1000 + 100, // Random total between 100 and 1100
          status: statuses[Math.floor(Math.random() * statuses.length)], // "paid" or "pending"
          createdAt,
          deliveredAt,
          items: [
            {
              ingredientId: new mongoose.Types.ObjectId(), // Random ObjectID (adjust if needed)
              quantity: Math.floor(Math.random() * 10) + 1,
              price: Math.random() * 50,
            },
          ],
        };
        invoices.push(invoice);
        console.log(
          `Created Invoice for ${supplier.name}: ${invoice.invoiceNumber}, ` +
          `CreatedAt: ${invoice.createdAt.toISOString()}, ` +
          `DeliveredAt: ${invoice.deliveredAt.toISOString()}, ` +
          `Status: ${invoice.status}`
        );
      }
    }

    // Insert all invoices
    await Invoice.insertMany(invoices);
    console.log(`Created ${invoices.length} invoices`);

    // Verify the data in the database
    const invoiceCount = await Invoice.countDocuments({
      createdAt: { $gte: new Date("2025-01-01"), $lte: new Date("2025-12-31") },
      deliveredAt: { $ne: null },
      status: { $in: ["paid", "pending"] },
    });
    console.log(`Total invoices matching criteria: ${invoiceCount}`);

    console.log("Big data seeded successfully!");
  } catch (error) {
    console.error("Error seeding big data:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

seedData();