const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Restaurant = require('../models/restaurant');
const Stock = require('../models/stock');
const Supplier = require('../models/supplier');
const ConsumptionHistory = require('../models/ConsumptionHistory');

// Define Category model (since Stock.type references Category)
const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({
  name: { type: String, required: true },
}));

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/the-menufy';

async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Utility to generate past dates for consumption history
const getPastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

// Clear existing data
async function clearCollections() {
  try {
    await Restaurant.deleteMany({});
    await Stock.deleteMany({});
    await Supplier.deleteMany({});
    await ConsumptionHistory.deleteMany({});
    await Category.deleteMany({});
    await mongoose.connection.collection('recipes').deleteMany({});
    console.log('Cleared all data from restaurants, stocks, suppliers, consumptionhistories, categories, and recipes collections');

    // Verify deletion
    const counts = {
      restaurants: await Restaurant.countDocuments(),
      stocks: await Stock.countDocuments(),
      suppliers: await Supplier.countDocuments(),
      consumptionhistories: await ConsumptionHistory.countDocuments(),
      categories: await Category.countDocuments(),
      recipes: await mongoose.connection.collection('recipes').countDocuments(),
    };
    console.log('Collection counts after deletion:', counts);
  } catch (error) {
    console.error('Error clearing collections:', error);
    throw error;
  }
}

// Seed data
async function seedData() {
  try {
    // Clear existing data
    await clearCollections();

    // Create Categories
    const categories = [
      { name: 'Ingredients' },
      { name: 'Spices' },
      { name: 'Dairy' },
    ];
    const categoryDocs = await Category.insertMany(categories);
    console.log(`Inserted ${categoryDocs.length} categories`);

    // Create Restaurants
    const restaurants = [
      {
        nameRes: 'Tasty Bistro',
        address: '123 Maple Street, Montreal, QC',
        cuisineType: 'Italian',
        taxeTPS: 5,
        taxeTVQ: 9.975,
        color: '#FF5733',
        logo: 'https://example.com/logo1.png',
        promotion: '10% off on Tuesdays',
        payCashMethod: true,
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      },
      {
        nameRes: 'Spicy Haven',
        address: '456 Oak Avenue, Toronto, ON',
        cuisineType: 'Indian',
        taxeTPS: 5,
        taxeTVQ: 9.975,
        color: '#33FF57',
        logo: 'https://example.com/logo2.png',
        promotion: 'Free dessert with dinner',
        payCashMethod: false,
        images: ['https://example.com/image3.jpg'],
      },
    ];
    const restaurantDocs = await Restaurant.insertMany(restaurants);
    console.log(`Inserted ${restaurantDocs.length} restaurants`);

    // Create Stocks
    const stockData = [
      {
        libelle: 'Tomato Sauce',
        quantity: 100,
        type: categoryDocs[0]._id, // Ingredients
        price: 2.5,
        disponibility: true,
        maxQty: 200,
        minQty: 20,
        shelfLifeDays: 90,
        unit: 'l',
        restaurant: restaurantDocs[0]._id, // Tasty Bistro
      },
      {
        libelle: 'Pasta',
        quantity: 150,
        type: categoryDocs[0]._id, // Ingredients
        price: 1.8,
        disponibility: true,
        maxQty: 300,
        minQty: 30,
        shelfLifeDays: 180,
        unit: 'kg',
        restaurant: restaurantDocs[0]._id, // Tasty Bistro
      },
      {
        libelle: 'Mozzarella Cheese',
        quantity: 80,
        type: categoryDocs[2]._id, // Dairy
        price: 4.0,
        disponibility: true,
        maxQty: 150,
        minQty: 15,
        shelfLifeDays: 30,
        unit: 'kg',
        restaurant: restaurantDocs[0]._id, // Tasty Bistro
      },
      {
        libelle: 'Curry Powder',
        quantity: 50,
        type: categoryDocs[1]._id, // Spices
        price: 3.0,
        disponibility: true,
        maxQty: 100,
        minQty: 10,
        shelfLifeDays: 360,
        unit: 'kg',
        restaurant: restaurantDocs[1]._id, // Spicy Haven
      },
      {
        libelle: 'Rice',
        quantity: 200,
        type: categoryDocs[0]._id, // Ingredients
        price: 1.2,
        disponibility: true,
        maxQty: 400,
        minQty: 40,
        shelfLifeDays: 360,
        unit: 'kg',
        restaurant: restaurantDocs[1]._id, // Spicy Haven
      },
      {
        libelle: 'Cream',
        quantity: 60,
        type: categoryDocs[2]._id, // Dairy
        price: 3.5,
        disponibility: true,
        maxQty: 120,
        minQty: 12,
        shelfLifeDays: 14,
        unit: 'l',
        restaurant: restaurantDocs[1]._id, // Spicy Haven
      },
    ];
    const stockDocs = await Stock.insertMany(stockData);
    console.log(`Inserted ${stockDocs.length} stocks`);

    // Create Suppliers
    const supplierData = [
      {
        name: 'FoodCo Supplies',
        stocks: [
          {
            stockId: stockDocs[0]._id, // Tomato Sauce
            pricePerUnit: 2.0,
            leadTimeDays: 3,
            moq: 10,
            qualityScore: 90,
          },
          {
            stockId: stockDocs[1]._id, // Pasta
            pricePerUnit: 1.5,
            leadTimeDays: 2,
            moq: 20,
            qualityScore: 85,
          },
          {
            stockId: stockDocs[2]._id, // Mozzarella Cheese
            pricePerUnit: 3.8,
            leadTimeDays: 4,
            moq: 15,
            qualityScore: 88,
          },
        ],
        contact: {
          email: `contact_foodco_${uuidv4()}@example.com`,
          phone: '+15145550123',
          representative: 'John Doe',
        },
        address: {
          street: '789 Pine Road',
          city: 'Montreal',
          state: 'QC',
          postalCode: 'H3B 2Y5',
          country: 'Canada',
        },
        contract: {
          startDate: new Date('2025-01-01'),
          endDate: new Date('2026-01-01'),
          terms: 'NET_30',
          minimumOrder: 100,
          specialConditions: 'No returns after 30 days',
        },
        status: 'active',
        payment: {
          currency: 'CAD',
          preferredMethod: 'bank',
          accountDetails: 'Bank of Montreal, Account #123456',
        },
        restaurantId: restaurantDocs[0]._id, // Tasty Bistro
        notes: 'Reliable supplier for Italian ingredients',
      },
      {
        name: 'SpiceWorld',
        stocks: [
          {
            stockId: stockDocs[3]._id, // Curry Powder
            pricePerUnit: 2.8,
            leadTimeDays: 4,
            moq: 5,
            qualityScore: 88,
          },
          {
            stockId: stockDocs[4]._id, // Rice
            pricePerUnit: 1.0,
            leadTimeDays: 3,
            moq: 50,
            qualityScore: 90,
          },
          {
            stockId: stockDocs[5]._id, // Cream
            pricePerUnit: 3.2,
            leadTimeDays: 2,
            moq: 10,
            qualityScore: 85,
          },
        ],
        contact: {
          email: `sales_spiceworld_${uuidv4()}@example.com`,
          phone: '+14165550124',
          representative: 'Jane Smith',
        },
        address: {
          street: '321 Cedar Lane',
          city: 'Toronto',
          state: 'ON',
          postalCode: 'M5V 3Y2',
          country: 'Canada',
        },
        contract: {
          startDate: new Date('2025-02-01'),
          endDate: new Date('2026-02-01'),
          terms: 'NET_60',
          minimumOrder: 50,
          specialConditions: 'Bulk discounts available',
        },
        status: 'active',
        payment: {
          currency: 'CAD',
          preferredMethod: 'credit',
          accountDetails: 'Visa ending in 1234',
        },
        restaurantId: restaurantDocs[1]._id, // Spicy Haven
        notes: 'Specializes in spices and grains',
      },
    ];
    const supplierDocs = await Supplier.insertMany(supplierData);
    console.log(`Inserted ${supplierDocs.length} suppliers`);

    // Create Recipes (directly in MongoDB collection)
    const recipeData = [
      {
        name: 'Margherita Pizza',
        items: [
          { stockId: stockDocs[0]._id, quantity: 0.5 }, // 0.5l Tomato Sauce
          { stockId: stockDocs[2]._id, quantity: 0.2 }, // 0.2kg Mozzarella
        ],
        servings: 4,
        salePrice: 12.0,
        restaurantId: restaurantDocs[0]._id, // Tasty Bistro
      },
      {
        name: 'Pasta Alfredo',
        items: [
          { stockId: stockDocs[1]._id, quantity: 0.3 }, // 0.3kg Pasta
          { stockId: stockDocs[2]._id, quantity: 0.1 }, // 0.1kg Mozzarella
        ],
        servings: 2,
        salePrice: 8.0,
        restaurantId: restaurantDocs[0]._id, // Tasty Bistro
      },
      {
        name: 'Butter Chicken',
        items: [
          { stockId: stockDocs[3]._id, quantity: 0.05 }, // 0.05kg Curry Powder
          { stockId: stockDocs[5]._id, quantity: 0.2 }, // 0.2l Cream
        ],
        servings: 2,
        salePrice: 15.0,
        restaurantId: restaurantDocs[1]._id, // Spicy Haven
      },
      {
        name: 'Biryani',
        items: [
          { stockId: stockDocs[4]._id, quantity: 0.5 }, // 0.5kg Rice
          { stockId: stockDocs[3]._id, quantity: 0.03 }, // 0.03kg Curry Powder
        ],
        servings: 3,
        salePrice: 10.0,
        restaurantId: restaurantDocs[1]._id, // Spicy Haven
      },
    ];
    await mongoose.connection.collection('recipes').insertMany(recipeData);
    console.log(`Inserted ${recipeData.length} recipes`);

    // Create Consumption History (40 days for each stock)
    const consumptionData = [];
    for (const stock of stockDocs) {
      const restaurantId = stock.restaurant;
      for (let i = 0; i < 40; i++) {
        consumptionData.push({
          restaurantId,
          stockId: stock._id,
          qty: Math.floor(Math.random() * 10) + 1, // Random qty between 1 and 10
          createdAt: getPastDate(i),
          wastageQty: Math.random() > 0.8 ? Math.floor(Math.random() * 3) : undefined, // 20% chance of wastage
        });
      }
    }
    await ConsumptionHistory.insertMany(consumptionData);
    console.log(`Inserted ${consumptionData.length} consumption history records`);

    // Verify inserted data
    const finalCounts = {
      restaurants: await Restaurant.countDocuments(),
      stocks: await Stock.countDocuments(),
      suppliers: await Supplier.countDocuments(),
      consumptionhistories: await ConsumptionHistory.countDocuments(),
      categories: await Category.countDocuments(),
      recipes: await mongoose.connection.collection('recipes').countDocuments(),
    };
    console.log('Final collection counts:', finalCounts);

    // Verify consumption history has 40 unique days per stock
    for (const stock of stockDocs) {
      const uniqueDays = await ConsumptionHistory.aggregate([
        { $match: { stockId: stock._id } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } } },
        { $count: 'unique_days' },
      ]);
      console.log(`Stock ${stock.libelle} has ${uniqueDays[0]?.unique_days || 0} unique days of consumption data`);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

// Main function to run deletion and seeding
async function runSeed() {
  await connectToMongoDB();
  try {
    await seedData();
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed
runSeed();