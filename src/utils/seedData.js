const mongoose = require('mongoose');
const yup = require('yup'); // Added Yup import
const Restaurant = require('../models/restaurant');
const Stock = require('../models/stock');
const Supplier = require('../models/supplier');
const ConsumptionHistory = require('../models/ConsumptionHistory');
const User = require('../models/user');
const Category = require('../models/Category');
const PriceHistory = require('../models/PriceHistory');
const Order = require('../models/Ordre');
const MenuItem = require('../models/MenuItem');
const Invoice = require('../models/invoice');
const InvoiceItem = require('../models/InvoiceItem');
const Ingredient = require('../models/ingredient');
const ForecastedSales = require('../models/ForecastedSales');
const Employee = require('../models/Employee');
const Admin = require('../models/Admin');
const { restaurantSchema } = require('../modules/restaurant/validators/restaurantvalidators');
const { ingredientSchema } = require('../modules/ingredient/validators/ingredientValidator');
const { validateSupplier } = require('../modules/supplier/validators/supplierValidators');
const { userSchema } = require('../modules/user/validators/userValidator');
const { adminSchema } = require('../modules/admin/validators/adminValidtor');
const { employeeSchema } = require('../modules/employee/validators/employeeValidator');
const { invoiceItemSchema } = require('../modules/invoice/validators/invoiceItemValidator');
const { invoiceSchema } = require('../modules/invoice/validators/invoiceValidator');
const { profileUpdateSchema } = require('../modules/auth/validators/profileValidator');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/the-menufy');
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
  const res = {
    status: (code) => ({
      json: (response) => {
        throw new Error(`Express-validator failed for ${type}: ${JSON.stringify(response)}`);
      },
    }),
  };
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
      PriceHistory.deleteMany({}),
      Order.deleteMany({}),
      MenuItem.deleteMany({}),
      Invoice.deleteMany({}),
      InvoiceItem.deleteMany({}),
      Ingredient.deleteMany({}),
      ForecastedSales.deleteMany({}),
      Employee.deleteMany({}),
      Admin.deleteMany({}),
    ]);
    console.log('Cleared all collections');

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
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789106', 'Category Dairy _id')),
        name: 'Dairy',
        description: 'Dairy products',
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789107', 'Category Meat _id')),
        name: 'Meat',
        description: 'Meat and poultry',
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789108', 'Category Beverages _id')),
        name: 'Beverages',
        description: 'Drinks and beverages',
      },
    ];
    const categories = await Category.insertMany(categoryData);
    console.log(`Created ${categories.length} categories`);

    // Create Restaurant
    const restaurantData = [
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
        nameRes: 'Test Restaurant 1',
        address: '123 Main St, Toronto, ON, M5V 2H1, Canada',
        cuisineType: 'International',
        taxeTPS: 5,
        taxeTVQ: 9.975,
        payCashMethod: true,
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789002', 'Restaurant Test 2 _id')),
        nameRes: 'Test Restaurant 2',
        address: '456 Oak St, Montreal, QC, H3B 2Y5, Canada',
        cuisineType: 'French',
        taxeTPS: 5,
        taxeTVQ: 9.975,
        payCashMethod: false,
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789003', 'Restaurant Test 3 _id')),
        nameRes: 'Test Restaurant 3',
        address: '789 Pine St, Vancouver, BC, V6C 2E8, Canada',
        cuisineType: 'Asian',
        taxeTPS: 5,
        taxeTVQ: 9.975,
        payCashMethod: true,
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789004', 'Restaurant Test 4 _id')),
        nameRes: 'Test Restaurant 4',
        address: '101 Maple St, Calgary, AB, T2P 4R4, Canada',
        cuisineType: 'Italian',
        taxeTPS: 5,
        taxeTVQ: 9.975,
        payCashMethod: false,
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Restaurant Test 5 _id')),
        nameRes: 'Test Restaurant 5',
        address: '202 Elm St, Ottawa, ON, K1P 5G3, Canada',
        cuisineType: 'Mediterranean',
        taxeTPS: 5,
        taxeTVQ: 9.975,
        payCashMethod: true,
      },
    ];
    for (const data of restaurantData) {
      await validateYupData(restaurantSchema, data, 'Restaurant');
      const restaurant = await Restaurant.create(data);
      console.log(`Created Restaurant: ${restaurant.nameRes}`);
    }

    // Create Admin User
    const adminData = {
      _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789101', 'Admin 1 _id')),
      firstName: 'Admin',
      lastName: 'Test',
      email: 'admin.test@example.com',
      password: 'password123',
      authProvider: 'local',
      restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
      isVerified: false,
    };
    await validateYupData(adminSchema, adminData, 'Admin');
    const admin = await Admin.create(adminData);
    console.log(`Created Admin: ${admin.email}`);

    // Create Employee User
    const employeeData = {
      _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789102', 'Employee 1 _id')),
      firstName: 'Employee',
      lastName: 'Test',
      email: 'employee.test@example.com',
      password: 'password123',
      authProvider: 'local',
      salary: 30000,
      restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    };
    await validateYupData(employeeSchema, employeeData, 'Employee');
    const employee = await Employee.create(employeeData);
    console.log(`Created Employee: ${employee.email}`);

    // Create Stocks
    const stockData = [
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789004', 'Stock Flour _id')),
        libelle: 'Flour',
        quantity: 20,
        type: categories[0]._id,
        price: 2.5,
        disponibility: true,
        maxQty: 100,
        minQty: 30,
        shelfLifeDays: 90,
        unit: 'kg',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Stock Tomato Sauce _id')),
        libelle: 'Tomato Sauce',
        quantity: 50,
        type: categories[1]._id,
        price: 3.0,
        disponibility: true,
        maxQty: 200,
        minQty: 20,
        shelfLifeDays: 180,
        unit: 'l',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789006', 'Stock Sugar _id')),
        libelle: 'Sugar',
        quantity: 30,
        type: categories[0]._id,
        price: 1.8,
        disponibility: true,
        maxQty: 150,
        minQty: 25,
        shelfLifeDays: 365,
        unit: 'kg',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Restaurant Test 5 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789007', 'Stock Olive Oil _id')),
        libelle: 'Olive Oil',
        quantity: 40,
        type: categories[1]._id,
        price: 5.0,
        disponibility: true,
        maxQty: 100,
        minQty: 15,
        shelfLifeDays: 720,
        unit: 'l',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Restaurant Test 5 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789008', 'Stock Milk _id')),
        libelle: 'Milk',
        quantity: 60,
        type: categories[2]._id,
        price: 1.2,
        disponibility: true,
        maxQty: 200,
        minQty: 40,
        shelfLifeDays: 30,
        unit: 'l',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Restaurant Test 5 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789009', 'Stock Cheese _id')),
        libelle: 'Cheese',
        quantity: 40,
        type: categories[2]._id,
        price: 4.0,
        disponibility: true,
        maxQty: 100,
        minQty: 20,
        shelfLifeDays: 60,
        unit: 'kg',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')), // Changed to Test Restaurant 1
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789010', 'Stock Chicken _id')),
        libelle: 'Chicken',
        quantity: 50,
        type: categories[3]._id,
        price: 3.5,
        disponibility: true,
        maxQty: 120,
        minQty: 20,
        shelfLifeDays: 45,
        unit: 'kg',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Restaurant Test 5 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789011', 'Stock Beef _id')),
        libelle: 'Beef',
        quantity: 40,
        type: categories[3]._id,
        price: 6.0,
        disponibility: true,
        maxQty: 100,
        minQty: 15,
        shelfLifeDays: 45,
        unit: 'kg',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Restaurant Test 5 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789012', 'Stock Cola _id')),
        libelle: 'Cola',
        quantity: 100,
        type: categories[4]._id,
        price: 1.0,
        disponibility: true,
        maxQty: 300,
        minQty: 50,
        shelfLifeDays: 365,
        unit: 'l',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Restaurant Test 5 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789013', 'Stock Water _id')),
        libelle: 'Water',
        quantity: 150,
        type: categories[4]._id,
        price: 0.5,
        disponibility: true,
        maxQty: 500,
        minQty: 100,
        shelfLifeDays: 730,
        unit: 'l',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Restaurant Test 5 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789014', 'Stock Yeast _id')),
        libelle: 'Yeast',
        quantity: 10,
        type: categories[0]._id,
        price: 2.0,
        disponibility: true,
        maxQty: 50,
        minQty: 5,
        shelfLifeDays: 180,
        unit: 'kg',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Restaurant Test 5 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789015', 'Stock Ketchup _id')),
        libelle: 'Ketchup',
        quantity: 30,
        type: categories[1]._id,
        price: 2.8,
        disponibility: true,
        maxQty: 150,
        minQty: 20,
        shelfLifeDays: 365,
        unit: 'l',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Restaurant Test 5 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789016', 'Stock Butter _id')),
        libelle: 'Butter',
        quantity: 20,
        type: categories[2]._id,
        price: 3.2,
        disponibility: true,
        maxQty: 60,
        minQty: 10,
        shelfLifeDays: 90,
        unit: 'kg',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Restaurant Test 5 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789017', 'Stock Pork _id')),
        libelle: 'Pork',
        quantity: 35,
        type: categories[3]._id,
        price: 4.5,
        disponibility: true,
        maxQty: 80,
        minQty: 15,
        shelfLifeDays: 45,
        unit: 'kg',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789005', 'Restaurant Test 5 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789018', 'Stock Juice _id')),
        libelle: 'Orange Juice',
        quantity: 80,
        type: categories[4]._id,
        price: 1.5,
        disponibility: true,
        maxQty: 200,
        minQty: 40,
        shelfLifeDays: 180,
        unit: 'l',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789004', 'Restaurant Test 4 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789019', 'Stock Salt _id')),
        libelle: 'Salt',
        quantity: 15,
        type: categories[0]._id,
        price: 0.8,
        disponibility: true,
        maxQty: 80,
        minQty: 10,
        shelfLifeDays: 730,
        unit: 'kg',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789002', 'Restaurant Test 2 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789020', 'Stock Mustard _id')),
        libelle: 'Mustard',
        quantity: 25,
        type: categories[1]._id,
        price: 2.2,
        disponibility: true,
        maxQty: 100,
        minQty: 15,
        shelfLifeDays: 365,
        unit: 'l',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789002', 'Restaurant Test 2 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789021', 'Stock Yogurt _id')),
        libelle: 'Yogurt',
        quantity: 50,
        type: categories[2]._id,
        price: 1.8,
        disponibility: true,
        maxQty: 150,
        minQty: 30,
        shelfLifeDays: 30,
        unit: 'l',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789022', 'Stock Lamb _id')),
        libelle: 'Lamb',
        quantity: 30,
        type: categories[3]._id,
        price: 7.0,
        disponibility: true,
        maxQty: 70,
        minQty: 10,
        shelfLifeDays: 45,
        unit: 'kg',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789023', 'Stock Soda _id')),
        libelle: 'Lemon Soda',
        quantity: 90,
        type: categories[4]._id,
        price: 1.2,
        disponibility: true,
        maxQty: 250,
        minQty: 50,
        shelfLifeDays: 365,
        unit: 'l',
        restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789003', 'Restaurant Test 3 _id')),
      },
    ];
    for (const stock of stockData) {
      await validateYupData(ingredientSchema, stock, 'Stock');
    }
    const stocks = await Stock.insertMany(stockData);
    console.log(`Created ${stocks.length} stocks`);

    // Create Ingredients
    const ingredientData = [
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789006', 'Ingredient Salt _id')),
        libelle: 'Salt',
        quantity: 10,
        type: categories[0]._id,
        price: 1.0,
        disponibility: true,
        maxQty: 50,
        minQty: 5,
        unit: 'kg',
      },
    ];
    for (const ingredient of ingredientData) {
      await validateYupData(ingredientSchema, ingredient, 'Ingredient');
    }
    const ingredients = await Ingredient.insertMany(ingredientData);
    console.log(`Created ${ingredients.length} ingredients`);

    // Create Suppliers
    const supplierData = [
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789007', 'Supplier A _id')),
    name: 'Supplier A',
    stocks: [
      { stockId: stocks[0]._id, pricePerUnit: 2.5, leadTimeDays: 3, moq: 10, qualityScore: 85 },
      { stockId: stocks[1]._id, pricePerUnit: 3.0, leadTimeDays: 4, moq: 15, qualityScore: 80 },
    ],
    contact: { email: 'supplierA@example.com', phone: '+12025550123', representative: 'John Doe' },
    address: { street: '456 Supplier Rd', city: 'Toronto', state: 'ON', postalCode: 'M5V 2H2', country: 'Canada' },
    contract: { startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), terms: 'NET_30', minimumOrder: 50 },
    status: 'active',
    payment: { currency: 'CAD', preferredMethod: 'bank' },
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789003', 'Restaurant Test 3 _id')),
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789008', 'Supplier B _id')),
    name: 'Supplier B',
    stocks: [
      { stockId: stocks[2]._id, pricePerUnit: 1.8, leadTimeDays: 5, moq: 20, qualityScore: 90 },
      { stockId: stocks[3]._id, pricePerUnit: 5.0, leadTimeDays: 6, moq: 25, qualityScore: 88 },
    ],
    contact: { email: 'supplierB@example.com', phone: '+12025550124', representative: 'Jane Smith' },
    address: { street: '789 Supplier Ave', city: 'Toronto', state: 'ON', postalCode: 'M5V 2H3', country: 'Canada' },
    contract: { startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), terms: 'NET_60', minimumOrder: 100 },
    status: 'active',
    payment: { currency: 'CAD', preferredMethod: 'credit' },
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789004', 'Restaurant Test 4 _id')),
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789009', 'Supplier C _id')),
    name: 'Supplier C',
    stocks: [
      { stockId: stocks[4]._id, pricePerUnit: 1.2, leadTimeDays: 2, moq: 30, qualityScore: 92 },
      { stockId: stocks[5]._id, pricePerUnit: 4.0, leadTimeDays: 3, moq: 10, qualityScore: 87 },
    ],
    contact: { email: 'supplierC@example.com', phone: '+12025550125', representative: 'Mike Johnson' },
    address: { street: '101 Dairy Ln', city: 'Montreal', state: 'QC', postalCode: 'H3B 2Y5', country: 'Canada' },
    contract: { startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), terms: 'NET_30', minimumOrder: 75 },
    status: 'active',
    payment: { currency: 'CAD', preferredMethod: 'bank' },
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789003', 'Restaurant Test 3 _id')),
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789010', 'Supplier D _id')),
    name: 'Supplier D',
    stocks: [
      { stockId: stocks[6]._id, pricePerUnit: 3.5, leadTimeDays: 4, moq: 15, qualityScore: 89 },
      { stockId: stocks[7]._id, pricePerUnit: 6.0, leadTimeDays: 5, moq: 20, qualityScore: 91 },
    ],
    contact: { email: 'supplierD@example.com', phone: '+12025550126', representative: 'Emily Brown' },
    address: { street: '202 Meat St', city: 'Vancouver', state: 'BC', postalCode: 'V6C 2E8', country: 'Canada' },
    contract: { startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), terms: 'NET_30', minimumOrder: 60 },
    status: 'active',
    payment: { currency: 'CAD', preferredMethod: 'credit' },
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789002', 'Restaurant Test 2 _id')),
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789011', 'Supplier E _id')),
    name: 'Supplier E',
    stocks: [
      { stockId: stocks[8]._id, pricePerUnit: 1.0, leadTimeDays: 3, moq: 50, qualityScore: 85 },
      { stockId: stocks[9]._id, pricePerUnit: 0.5, leadTimeDays: 2, moq: 100, qualityScore: 90 },
    ],
    contact: { email: 'supplierE@example.com', phone: '+12025550127', representative: 'Sarah Wilson' },
    address: { street: '303 Drink Blvd', city: 'Calgary', state: 'AB', postalCode: 'T2P 4R4', country: 'Canada' },
    contract: { startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), terms: 'NET_60', minimumOrder: 150 },
    status: 'active',
    payment: { currency: 'CAD', preferredMethod: 'bank' },
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789002', 'Restaurant Test 2 _id')),
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789012', 'Supplier F _id')),
    name: 'Supplier F',
    stocks: [
      { stockId: stocks[10]._id, pricePerUnit: 2.0, leadTimeDays: 4, moq: 5, qualityScore: 88 },
      { stockId: stocks[11]._id, pricePerUnit: 2.8, leadTimeDays: 5, moq: 10, qualityScore: 86 },
    ],
    contact: { email: 'supplierF@example.com', phone: '+12025550128', representative: 'David Lee' },
    address: { street: '404 Baker St', city: 'Ottawa', state: 'ON', postalCode: 'K1P 5G3', country: 'Canada' },
    contract: { startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), terms: 'NET_30', minimumOrder: 40 },
    status: 'active',
    payment: { currency: 'CAD', preferredMethod: 'credit' },
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789013', 'Supplier G _id')),
    name: 'Supplier G',
    stocks: [
      { stockId: stocks[12]._id, pricePerUnit: 3.2, leadTimeDays: 3, moq: 10, qualityScore: 90 },
      { stockId: stocks[13]._id, pricePerUnit: 4.5, leadTimeDays: 4, moq: 15, qualityScore: 87 },
    ],
    contact: { email: 'supplierG@example.com', phone: '+12025550129', representative: 'Laura Adams' },
    address: { street: '505 Dairy Rd', city: 'Toronto', state: 'ON', postalCode: 'M5V 2H4', country: 'Canada' },
    contract: { startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), terms: 'NET_30', minimumOrder: 80 },
    status: 'active',
    payment: { currency: 'CAD', preferredMethod: 'bank' },
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789002', 'Restaurant Test 2 _id')),
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789014', 'Supplier H _id')),
    name: 'Supplier H',
    stocks: [
      { stockId: stocks[14]._id, pricePerUnit: 1.5, leadTimeDays: 2, moq: 20, qualityScore: 92 },
      { stockId: stocks[15]._id, pricePerUnit: 0.8, leadTimeDays: 3, moq: 30, qualityScore: 89 },
    ],
    contact: { email: 'supplierH@example.com', phone: '+12025550130', representative: 'Tom Clark' },
    address: { street: '606 Beverage Ave', city: 'Montreal', state: 'QC', postalCode: 'H3B 2Y6', country: 'Canada' },
    contract: { startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), terms: 'NET_60', minimumOrder: 120 },
    status: 'active',
    payment: { currency: 'CAD', preferredMethod: 'credit' },
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789003', 'Restaurant Test 3 _id')),
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789015', 'Supplier I _id')),
    name: 'Supplier I',
    stocks: [
      { stockId: stocks[16]._id, pricePerUnit: 2.2, leadTimeDays: 4, moq: 15, qualityScore: 86 },
      { stockId: stocks[17]._id, pricePerUnit: 1.8, leadTimeDays: 5, moq: 20, qualityScore: 91 },
    ],
    contact: { email: 'supplierI@example.com', phone: '+12025550131', representative: 'Anna White' },
    address: { street: '707 Condiment St', city: 'Vancouver', state: 'BC', postalCode: 'V6C 2E9', country: 'Canada' },
    contract: { startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), terms: 'NET_30', minimumOrder: 50 },
    status: 'active',
    payment: { currency: 'CAD', preferredMethod: 'bank' },
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789003', 'Restaurant Test 3 _id')),
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789016', 'Supplier J _id')),
    name: 'Supplier J',
    stocks: [
      { stockId: stocks[18]._id, pricePerUnit: 7.0, leadTimeDays: 3, moq: 10, qualityScore: 90 },
      { stockId: stocks[19]._id, pricePerUnit: 1.2, leadTimeDays: 2, moq: 40, qualityScore: 88 },
    ],
    contact: { email: 'supplierJ@example.com', phone: '+12025550132', representative: 'Mark Taylor' },
    address: { street: '808 Meat Blvd', city: 'Calgary', state: 'AB', postalCode: 'T2P 4R5', country: 'Canada' },
    contract: { startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), terms: 'NET_30', minimumOrder: 90 },
    status: 'active',
    payment: { currency: 'CAD', preferredMethod: 'credit' },
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789002', 'Restaurant Test 2 _id')),
  },
];
    // Create MenuItem
    const menuItemData = [
      {
        _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789009', 'MenuItem Pizza _id')),
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato and mozzarella',
        price: 12.99,
        stocks: [
          { stockId: stocks[0]._id, quantity: 0.5 },
          { stockId: stocks[1]._id, quantity: 0.2 },
        ],
      },
    ];
    for (const menuItem of menuItemData) {
      await validateYupData(yup.object().shape({ name: yup.string().required(), description: yup.string().optional(), price: yup.number().positive().required(), stocks: yup.array().of(yup.object().shape({ stockId: yup.string().required(), quantity: yup.number().positive().required() })).min(1) }), menuItem, 'MenuItem');
    }
    const menuItems = await MenuItem.insertMany(menuItemData);
    console.log(`Created ${menuItems.length} menu items`);

    // Create Order
    const orderData = {
      _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789010', 'Order 1 _id')),
      orderNb: 1001,
      date: new Date('2025-05-06'),
      tableNb: 'Table 5',
      statusOrder: 'completed',
      statusPay: 'paid',
      durationPreparation: '30 minutes',
      CartFK: new mongoose.Types.ObjectId(),
      BillFK: new mongoose.Types.ObjectId(),
      UserFK: admin._id,
    };
    await validateYupData(yup.object().shape({ orderNb: yup.number().required(), date: yup.date().required(), tableNb: yup.string().required(), statusOrder: yup.string().required(), statusPay: yup.string().required(), durationPreparation: yup.string().required(), CartFK: yup.string().required(), BillFK: yup.string().required(), UserFK: yup.string().required() }), orderData, 'Order');
    const order = await Order.create(orderData);
    console.log(`Created Order: ${order.orderNb}`);

    // Create Invoice
    const invoiceData = {
      _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789011', 'Invoice 1 _id')),
      invoiceNumber: 'INV-2023-001',
      created_by: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789102', 'Employee 1 _id')),
      restaurant: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
      supplier: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789007', 'Supplier A _id')),
      total: 299.99,
      status: 'pending',
      paidStatus: 'nopaid',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15'),
      deliveredAt: null,
      items: [
        {
          stock: stocks[0]._id.toString(),
          quantity: 10,
          price: 2.5,
        },
      ],
    };
    console.log('Invoice data before validation:', JSON.stringify(invoiceData, null, 2)); // Debug log
    await validateYupData(invoiceSchema, invoiceData, 'Invoice');
    const invoice = await Invoice.create(invoiceData);
    console.log(`Created Invoice: ${invoice.invoiceNumber}`);

    // Create InvoiceItem
    const invoiceItemData = {
      _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789012', 'InvoiceItem 1 _id')),
      invoice: invoice._id,
      stock: stocks[0]._id,
      quantity: 10,
      price: 2.5,
    };
    await validateYupData(invoiceItemSchema, invoiceItemData, 'InvoiceItem');
    const invoiceItem = await InvoiceItem.create(invoiceItemData);
    console.log(`Created InvoiceItem for stock: ${stocks[0].libelle}`);

    // Create PriceHistory
   // Create Suppliers (this section already exists, ensure it runs successfully)
for (const supplier of supplierData) {
  await validateExpressData(validateSupplier, supplier, 'Supplier');
}
const suppliers = await Supplier.insertMany(supplierData);
console.log(`Created ${suppliers.length} suppliers`);

// Create MenuItem (this section already exists)
// ... existing code ...

// Create Order (this section already exists)
// ... existing code ...

// Create Invoice (this section already exists)
// ... existing code ...

// Create InvoiceItem (this section already exists)
// ... existing code ...

// Create PriceHistory (move this section after Suppliers creation)
const priceHistoryData = [
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789013', 'PriceHistory 1 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[0]._id,
    stockId: stocks[0]._id,
    invoiceId: invoice._id,
    price: 2.5,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789014', 'PriceHistory 2 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[0]._id,
    stockId: stocks[1]._id,
    invoiceId: invoice._id,
    price: 3.0,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789015', 'PriceHistory 3 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[1]._id,
    stockId: stocks[2]._id,
    invoiceId: invoice._id,
    price: 1.8,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789016', 'PriceHistory 4 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[1]._id,
    stockId: stocks[3]._id,
    invoiceId: invoice._id,
    price: 5.0,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789017', 'PriceHistory 5 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[2]._id,
    stockId: stocks[4]._id,
    invoiceId: invoice._id,
    price: 1.2,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789018', 'PriceHistory 6 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[2]._id,
    stockId: stocks[5]._id,
    invoiceId: invoice._id,
    price: 4.0,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789019', 'PriceHistory 7 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[3]._id,
    stockId: stocks[6]._id,
    invoiceId: invoice._id,
    price: 3.5,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789020', 'PriceHistory 8 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[3]._id,
    stockId: stocks[7]._id,
    invoiceId: invoice._id,
    price: 6.0,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789021', 'PriceHistory 9 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[4]._id,
    stockId: stocks[8]._id,
    invoiceId: invoice._id,
    price: 1.0,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789022', 'PriceHistory 10 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[4]._id,
    stockId: stocks[9]._id,
    invoiceId: invoice._id,
    price: 0.5,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789023', 'PriceHistory 11 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[5]._id,
    stockId: stocks[10]._id,
    invoiceId: invoice._id,
    price: 2.0,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789024', 'PriceHistory 12 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[5]._id,
    stockId: stocks[11]._id,
    invoiceId: invoice._id,
    price: 2.8,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789025', 'PriceHistory 13 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[6]._id,
    stockId: stocks[12]._id,
    invoiceId: invoice._id,
    price: 3.2,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789026', 'PriceHistory 14 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[6]._id,
    stockId: stocks[13]._id,
    invoiceId: invoice._id,
    price: 4.5,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789027', 'PriceHistory 15 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[7]._id,
    stockId: stocks[14]._id,
    invoiceId: invoice._id,
    price: 1.5,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789028', 'PriceHistory 16 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[7]._id,
    stockId: stocks[15]._id,
    invoiceId: invoice._id,
    price: 0.8,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789029', 'PriceHistory 17 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[8]._id,
    stockId: stocks[16]._id,
    invoiceId: invoice._id,
    price: 2.2,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789030', 'PriceHistory 18 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[8]._id,
    stockId: stocks[17]._id,
    invoiceId: invoice._id,
    price: 1.8,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789031', 'PriceHistory 19 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[9]._id,
    stockId: stocks[18]._id,
    invoiceId: invoice._id,
    price: 7.0,
  },
  {
    _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789032', 'PriceHistory 20 _id')),
    restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
    supplierId: suppliers[9]._id,
    stockId: stocks[19]._id,
    invoiceId: invoice._id,
    price: 1.2,
  },
];
for (const data of priceHistoryData) {
  await validateYupData(yup.object().shape({ restaurantId: yup.string().required(), supplierId: yup.string().required(), stockId: yup.string().required(), invoiceId: yup.string().required(), price: yup.number().positive().required() }), data, 'PriceHistory');
  const priceHistory = await PriceHistory.create(data);
  console.log(`Created PriceHistory for stock: ${stocks.find(s => s._id.toString() === data.stockId.toString()).libelle}`);
}
    // Create ForecastedSales
    const forecastedSalesData = {
      _id: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789014', 'ForecastedSales 1 _id')),
      menuItemId: menuItems[0]._id,
      forecastedQty: 50,
      forecastDate: new Date('2025-06-01'),
    };
    await validateYupData(yup.object().shape({ menuItemId: yup.string().required(), forecastedQty: yup.number().positive().required(), forecastDate: yup.date().required() }), forecastedSalesData, 'ForecastedSales');
    const forecastedSales = await ForecastedSales.create(forecastedSalesData);
    console.log(`Created ForecastedSales for menu item: ${menuItems[0].name}`);

    // Create Consumption History
    const consumptionHistoryData = [];
    const startDate = new Date('2025-03-01');
    for (let i = 0; i < 30; i++) {
      consumptionHistoryData.push({
        _id: new mongoose.Types.ObjectId(),
        restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
        stockId: stocks[0]._id,
        qty: Math.floor(Math.random() * 5) + 5,
        createdAt: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
      });
      consumptionHistoryData.push({
        _id: new mongoose.Types.ObjectId(),
        restaurantId: new mongoose.Types.ObjectId(validateObjectId('671234567890123456789001', 'Restaurant Test 1 _id')),
        stockId: stocks[1]._id,
        qty: Math.floor(Math.random() * 10) + 10,
        createdAt: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
      });
    }
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
      priceHistories: await PriceHistory.countDocuments(),
      orders: await Order.countDocuments(),
      menuItems: await MenuItem.countDocuments(),
      invoices: await Invoice.countDocuments(),
      invoiceItems: await InvoiceItem.countDocuments(),
      ingredients: await Ingredient.countDocuments(),
      forecastedSales: await ForecastedSales.countDocuments(),
      employees: await Employee.countDocuments(),
      admins: await Admin.countDocuments(),
    };
    console.log('Seed summary:', counts);

    // Verify critical documents
    const stock = await Stock.findOne({ _id: new mongoose.Types.ObjectId('671234567890123456789005') });
    console.log('Stock verification:', stock ? 'Stock found' : 'Stock NOT found');
    const supplier = await Supplier.findOne({ 'stocks.stockId': new mongoose.Types.ObjectId('671234567890123456789005') });
    console.log('Supplier verification:', supplier ? 'Supplier found' : 'Supplier NOT found');

    console.log('Data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
};

// Run seeding
seedData();