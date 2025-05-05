const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant');
const Stock = require('../models/stock');
const Supplier = require('../models/supplier');
const ConsumptionHistory = require('../models/ConsumptionHistory');
const User = require('../models/user'); // Assumed User model
const Category = require('../models/Category');
const { restaurantSchema } = require('../modules/restaurant/validators/restaurantvalidators');
const { ingredientSchema } = require('../modules/ingredient/validators/ingredientValidator');
const { validateSupplier } = require('../modules/supplier/validators/supplierValidators');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/the-menufy', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};

// Validate ObjectId
const validateObjectId = (id, context) => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new Error(`Invalid ObjectId in ${context}: ${id}`);
  }
  return id;
};

// Validate data using Yup schemas
const validateYupData = async (schema, data, type) => {
  try {
    await schema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(`Yup validation failed for ${type}: ${error.errors.join(', ')}`);
  }
};

// Validate data using Express-validator
const validateExpressData = async (validator, data, type) => {
  const req = { body: data };
  const res = { status: () => ({ json: console.log }) };
  let validationError = null;
  const next = (err) => {
    if (err) validationError = err;
  };

  for (const middleware of validator) {
    await middleware(req, res, next);
  }

  if (validationError) {
    throw new Error(`Express-validator failed for ${type}: ${validationError.message}`);
  }
};

// Seed data
const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      Restaurant.deleteMany({}),
      Stock.deleteMany({}),
      Supplier.deleteMany({}),
      ConsumptionHistory.deleteMany({}),
      User.deleteMany({}),
      Category.deleteMany({}),
    ]);
    console.log('Cleared restaurants, stocks, suppliers, consumption history, users, and categories');

    // Create Categories
    const categoryData = [
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789104', 'Category Baking _id')),
        name: 'Baking',
        description: 'Baking ingredients',
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789105', 'Category Condiments _id')),
        name: 'Condiments',
        description: 'Condiments and sauces',
      },
    ];
    const categories = await Category.insertMany(categoryData);
    console.log(`Created ${categories.length} categories`);

    // Create Restaurant
    const restaurantData = {
      _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test _id')),
      nameRes: 'Test Restaurant',
      address: '123 Main St, Toronto, ON, M5V 2H1, Canada',
      cuisineType: 'International',
      taxeTPS: 5,
      taxeTVQ: 9.975,
      payCashMethod: true,
    };
    await validateYupData(restaurantSchema, restaurantData, 'Restaurant');
    const restaurant = await Restaurant.create(restaurantData);
    console.log(`Created Restaurant: ${restaurant.nameRes}`);

    // Create User
    const userData = {
      _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789101', 'User 1 _id')),
      firstName: 'Admin',
      lastName: 'Test',
      email: 'admin.test@example.com',
      password: 'password123', // Assume hashed in production
      authProvider: 'local',
      restaurant: restaurant._id, // Link to restaurant
      role: 'admin', // Assumed field
    };
    const user = await User.create(userData);
    console.log(`Created User: ${user.email}`);

    // Create Stocks
    const stockData = [
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789004', 'Stock Flour _id')),
        libelle: 'Flour',
        quantity: 20, // Below minQty to trigger order
        type: categories[0]._id,
        price: 2.5,
        disponibility: true,
        maxQty: 100,
        minQty: 30,
        unit: 'kg',
        restaurant: restaurant._id,
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Stock Tomato Sauce _id')),
        libelle: 'Tomato Sauce',
        quantity: 50, // Above minQty, but consumption will trigger order
        type: categories[1]._id,
        price: 3.0,
        disponibility: true,
        maxQty: 200,
        minQty: 20,
        unit: 'l',
        restaurant: restaurant._id,
      },
    ];
    for (const stock of stockData) {
      await validateYupData(ingredientSchema, stock, 'Stock');
    }
    const stocks = await Stock.insertMany(stockData);
    console.log(`Created ${stocks.length} stocks`);

    // Create Suppliers
    const supplierData = [
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789006', 'Supplier A _id')),
        name: 'Supplier A',
        stocks: [
          {
            stockId: stocks[0]._id, // Flour
            pricePerUnit: 2.5,
            leadTimeDays: 3,
          },
        ],
        contact: {
          email: 'supplierA@example.com',
          phone: '+1234567890',
          representative: 'John Doe',
        },
        address: {
          street: '456 Supplier Rd',
          city: 'Toronto',
          state: 'ON',
          postalCode: 'M5V 2H2',
          country: 'Canada',
        },
        contract: {
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-12-31'),
          terms: 'NET_30',
          minimumOrder: 50,
        },
        status: 'active',
        payment: {
          currency: 'CAD',
          preferredMethod: 'bank',
        },
        restaurantId: restaurant._id,
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789007', 'Supplier B _id')),
        name: 'Supplier B',
        stocks: [
          {
            stockId: stocks[1]._id, // Tomato Sauce
            pricePerUnit: 3.0,
            leadTimeDays: 5,
          },
        ],
        contact: {
          email: 'supplierB@example.com',
          phone: '+0987654321',
          representative: 'Jane Smith',
        },
        address: {
          street: '789 Supplier Ave',
          city: 'Toronto',
          state: 'ON',
          postalCode: 'M5V 2H3',
          country: 'Canada',
        },
        contract: {
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-12-31'),
          terms: 'NET_60',
          minimumOrder: 100,
        },
        status: 'active',
        payment: {
          currency: 'CAD',
          preferredMethod: 'credit',
        },
        restaurantId: restaurant._id,
      },
    ];
    for (const supplier of supplierData) {
      await validateExpressData(validateSupplier, supplier, 'Supplier');
    }
    const suppliers = await Supplier.insertMany(supplierData);
    console.log(`Created ${suppliers.length} suppliers`);

    // Create Consumption History
    const consumptionHistoryData = [
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789008', 'ConsumptionHistory Flour 1 _id')),
        restaurantId: restaurant._id,
        stockId: stocks[0]._id, // Flour
        qty: 10,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789009', 'ConsumptionHistory Flour 2 _id')),
        restaurantId: restaurant._id,
        stockId: stocks[0]._id, // Flour
        qty: 15,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789010', 'ConsumptionHistory Tomato Sauce _id')),
        restaurantId: restaurant._id,
        stockId: stocks[1]._id, // Tomato Sauce
        qty: 30, // High consumption to trigger order
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ];
    const consumptionHistories = await ConsumptionHistory.insertMany(consumptionHistoryData);
    console.log(`Created ${consumptionHistories.length} consumption history entries`);

    // Verification
    const counts = {
      categories: await Category.countDocuments(),
      restaurants: await Restaurant.countDocuments(),
      stocks: await Stock.countDocuments(),
      suppliers: await Supplier.countDocuments(),
      consumptionHistories: await ConsumptionHistory.countDocuments(),
      users: await User.countDocuments(),
    };
    console.log('Seed summary:', counts);

    console.log('Data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
};

// Run seeding
seedData();