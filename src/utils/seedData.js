const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const Category = require("../models/category");
const Restaurant = require("../models/restaurant");
const Ingredient = require("../models/ingredient");
const Supplier = require("../models/supplier");
const ConsumptionHistory = require("../models/ConsumptionHistory");
const Order = require("../models/Ordre");
const Invoice = require("../models/invoice");
const User = require("../models/user");
const InvoiceItem = require("../models/invoiceItem");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/the-menufy")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Function to generate a random date
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Function to validate ObjectId
const validateObjectId = (id, context) => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new Error(`Invalid ObjectId in ${context}: ${id}`);
  }
  return id;
};

const seedData = async () => {
  try {
    // Initialize MongoDB client
    const client = new MongoClient("mongodb://localhost:27017");
    await client.connect();
    const db = client.db("the-menufy");

    // Clear existing data
    await Category.deleteMany({});
    await Restaurant.deleteMany({});
    await Ingredient.deleteMany({});
    await Supplier.deleteMany({});
    await ConsumptionHistory.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    await Invoice.deleteMany({});
    await InvoiceItem.deleteMany({});
    await db.collection("recipes").deleteMany({});
    console.log("Cleared categories, restaurants, ingredients, suppliers, consumption history, orders, users, invoices, invoice items, and recipes");

    // Create Users
    const userData = [
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789101", "User 1 _id")),
        firstName: "Admin",
        lastName: "Test",
        email: "admin.test@example.com",
        password: "password123",
        authProvider: "local",
        image: null,
        phone: null,
        address: null,
        birthday: null,
        isEmailVerified: false,
        verifiedDevices: [],
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789102", "User 2 _id")),
        firstName: "Admin",
        lastName: "Bistro",
        email: "admin.bistro@example.com",
        password: "password123",
        authProvider: "local",
        image: null,
        phone: null,
        address: null,
        birthday: null,
        isEmailVerified: false,
        verifiedDevices: [],
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789103", "User 3 _id")),
        firstName: "Admin",
        lastName: "Cafe",
        email: "admin.cafe@example.com",
        password: "password123",
        authProvider: "local",
        image: null,
        phone: null,
        address: null,
        birthday: null,
        isEmailVerified: false,
        verifiedDevices: [],
      },
    ];
    const users = [];
    for (const data of userData) {
      const user = await new User(data).save();
      users.push(user);
      console.log(`Created User: ${user.firstName} ${user.lastName}`);
    }

    // Create Categories
    const categoryData = [
      { _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789104", "Category Poultry _id")), name: "Poultry" },
      { _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789105", "Category Dairy _id")), name: "Dairy" },
      { _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789106", "Category Vegetables _id")), name: "Vegetables" },
      { _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789107", "Category Pantry _id")), name: "Pantry" },
      { _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789108", "Category Baking _id")), name: "Baking" },
    ];
    const categories = [];
    for (const data of categoryData) {
      const category = await new Category(data).save();
      categories.push(category);
      console.log(`Created Category: ${category.name}`);
    }

    // Create Restaurants
    const restaurantData = [
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789001", "Restaurant Test _id")),
        nameRes: "Test Restaurant",
        address: "123 Main St, Toronto, ON, M5V 2H1, Canada",
        cuisineType: "International",
        taxeTVQ: 9.975,
        taxeTPS: 5,
        payCashMethod: true,
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789002", "Restaurant Bistro _id")),
        nameRes: "City Bistro",
        address: "456 Queen St, Montreal, QC, H3C 1A2, Canada",
        cuisineType: "French",
        taxeTVQ: 9.975,
        taxeTPS: 5,
        payCashMethod: true,
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789003", "Restaurant Cafe _id")),
        nameRes: "Coastal Cafe",
        address: "789 Ocean Dr, Vancouver, BC, V6Z 2Y3, Canada",
        cuisineType: "Seafood",
        taxeTVQ: 0,
        taxeTPS: 5,
        payCashMethod: true,
      },
    ];
    const restaurants = [];
    for (const data of restaurantData) {
      console.log(`Creating Restaurant with _id: ${data._id}`);
      const restaurant = await new Restaurant(data).save();
      restaurants.push(restaurant);
      console.log(`Created Restaurant: ${restaurant.nameRes}`);
    }

    // Create Ingredients
    const ingredientData = [
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789004", "Ingredient Chicken _id")),
        libelle: "Chicken Breast",
        type: categories[0]._id,
        quantity: 50,
        price: 10,
        maxQty: 300,
        minQty: 10,
        unit: "kg",
        disponibility: true,
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789005", "Ingredient Cheese _id")),
        libelle: "Cheese",
        type: categories[1]._id,
        quantity: 80,
        price: 8,
        maxQty: 400,
        minQty: 30,
        unit: "kg",
        disponibility: true,
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789006", "Ingredient Tomatoes _id")),
        libelle: "Tomatoes",
        type: categories[2]._id,
        quantity: 100,
        price: 2.5,
        maxQty: 500,
        minQty: 20,
        unit: "kg",
        disponibility: true,
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789007", "Ingredient Olive Oil _id")),
        libelle: "Olive Oil",
        type: categories[3]._id,
        quantity: 200,
        price: 15,
        maxQty: 1000,
        minQty: 50,
        unit: "l",
        disponibility: true,
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789008", "Ingredient Flour _id")),
        libelle: "Flour",
        type: categories[4]._id,
        quantity: 300,
        price: 1.2,
        maxQty: 2000,
        minQty: 100,
        unit: "kg",
        disponibility: true,
      },
    ];
    const ingredients = [];
    for (const data of ingredientData) {
      const ingredient = await new Ingredient(data).save();
      ingredients.push(ingredient);
      console.log(`Created Ingredient: ${ingredient.libelle}`);
    }

    // Create Suppliers
    const suppliers = [];
    for (let i = 1; i <= 5; i++) {
      const supplier = await new Supplier({
        name: `Supplier ${i}`,
        ingredients: ingredients.map((ing) => ({
          ingredientId: ing._id,
          pricePerUnit: ing.price * (1 + Math.random() * 0.5),
          leadTimeDays: Math.floor(Math.random() * 5) + 1,
        })),
        contact: {
          email: `supplier${i}@example.com`,
          phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          representative: `Rep ${i}`,
        },
        address: {
          street: `${i} Main St`,
          city: "Toronto",
          state: "ON",
          postalCode: `M${i}V ${i}H${i}`,
          country: "Canada",
        },
        contract: {
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-12-31"),
          terms: "NET_30",
          minimumOrder: 50,
        },
        status: "active",
        payment: {
          currency: "CAD",
          preferredMethod: "bank",
          accountDetails: `Account ${i}`,
        },
        restaurantId: restaurants[Math.floor(Math.random() * restaurants.length)]._id,
      }).save();
      suppliers.push(supplier);
      console.log(`Created Supplier ${i}`);
    }

    // Create Orders for each restaurant
    const orders = [];
    for (const restaurant of restaurants) {
      const restaurantOrders = [
        {
          _id: new mongoose.Types.ObjectId(validateObjectId(`671234567890123456789${restaurants.indexOf(restaurant)}09`, `Order 1 _id for ${restaurant.nameRes}`)),
          orderNb: 1001 + restaurants.indexOf(restaurant) * 100,
          date: new Date("2025-04-01"),
          tableNb: "T1",
          statusOrder: "completed",
          statusPay: "paid",
          durationPreparation: "20min",
          noteClient: "No onions",
          suggestion: "Great service",
          code_Promo: "SAVE10",
          reason: "",
          CartFK: new mongoose.Types.ObjectId(validateObjectId(`671234567890123456789${restaurants.indexOf(restaurant)}10`, `Order 1 CartFK for ${restaurant.nameRes}`)),
          BillFK: new mongoose.Types.ObjectId(validateObjectId(`671234567890123456789${restaurants.indexOf(restaurant)}11`, `Order 1 BillFK for ${restaurant.nameRes}`)),
          UserFK: users[restaurants.indexOf(restaurant)]._id,
        },
        {
          _id: new mongoose.Types.ObjectId(validateObjectId(`671234567890123456789${restaurants.indexOf(restaurant)}12`, `Order 2 _id for ${restaurant.nameRes}`)),
          orderNb: 1002 + restaurants.indexOf(restaurant) * 100,
          date: new Date("2025-04-02"),
          tableNb: "T2",
          statusOrder: "pending",
          statusPay: "unpaid",
          durationPreparation: "15min",
          noteClient: "",
          suggestion: "",
          code_Promo: "",
          reason: "",
          CartFK: new mongoose.Types.ObjectId(validateObjectId(`671234567890123456789${restaurants.indexOf(restaurant)}13`, `Order 2 CartFK for ${restaurant.nameRes}`)),
          BillFK: new mongoose.Types.ObjectId(validateObjectId(`671234567890123456789${restaurants.indexOf(restaurant)}14`, `Order 2 BillFK for ${restaurant.nameRes}`)),
          UserFK: users[restaurants.indexOf(restaurant)]._id,
        },
      ];
      for (const data of restaurantOrders) {
        const order = await new Order(data).save();
        orders.push(order);
        console.log(`Created Order: ${order.orderNb} for Restaurant: ${restaurant.nameRes}`);
      }
    }

    // Create Recipes for each restaurant
    const recipeData = [
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789015", "Recipe Pizza _id")),
        restaurantId: restaurants[0]._id,
        name: "Spicy Chicken Pizza",
        items: [
          {
            ingredientId: ingredients[0]._id,
            quantity: 0.4,
            unit: ingredients[0].unit,
            costPerUnit: ingredients[0].price,
          },
          {
            ingredientId: ingredients[1]._id,
            quantity: 0.25,
            unit: ingredients[1].unit,
            costPerUnit: ingredients[1].price,
          },
        ],
        profitMargin: 40,
        salePrice: 0,
        servings: 4,
        createdAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
        updatedAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789016", "Recipe Parmesan _id")),
        restaurantId: restaurants[0]._id,
        name: "Chicken Parmesan",
        items: [
          {
            ingredientId: ingredients[0]._id,
            quantity: 0.5,
            unit: ingredients[0].unit,
            costPerUnit: ingredients[0].price,
          },
          {
            ingredientId: ingredients[1]._id,
            quantity: 0.2,
            unit: ingredients[1].unit,
            costPerUnit: ingredients[1].price,
          },
          {
            ingredientId: ingredients[2]._id,
            quantity: 0.3,
            unit: ingredients[2].unit,
            costPerUnit: ingredients[2].price,
          },
        ],
        profitMargin: 35,
        salePrice: 0,
        servings: 4,
        createdAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
        updatedAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789017", "Recipe Coq au Vin _id")),
        restaurantId: restaurants[1]._id,
        name: "Coq au Vin",
        items: [
          {
            ingredientId: ingredients[0]._id,
            quantity: 0.6,
            unit: ingredients[0].unit,
            costPerUnit: ingredients[0].price,
          },
          {
            ingredientId: ingredients[2]._id,
            quantity: 0.4,
            unit: ingredients[2].unit,
            costPerUnit: ingredients[2].price,
          },
        ],
        profitMargin: 45,
        salePrice: 0,
        servings: 2,
        createdAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
        updatedAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789018", "Recipe Crème Brûlée _id")),
        restaurantId: restaurants[1]._id,
        name: "Crème Brûlée",
        items: [
          {
            ingredientId: ingredients[1]._id,
            quantity: 0.3,
            unit: ingredients[1].unit,
            costPerUnit: ingredients[1].price,
          },
          {
            ingredientId: ingredients[4]._id,
            quantity: 0.2,
            unit: ingredients[4].unit,
            costPerUnit: ingredients[4].price,
          },
        ],
        profitMargin: 50,
        salePrice: 0,
        servings: 4,
        createdAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
        updatedAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789019", "Recipe Salmon _id")),
        restaurantId: restaurants[2]._id,
        name: "Grilled Salmon",
        items: [
          {
            ingredientId: ingredients[2]._id,
            quantity: 0.5,
            unit: ingredients[2].unit,
            costPerUnit: ingredients[2].price,
          },
          {
            ingredientId: ingredients[3]._id,
            quantity: 0.1,
            unit: ingredients[3].unit,
            costPerUnit: ingredients[3].price,
          },
        ],
        profitMargin: 30,
        salePrice: 0,
        servings: 2,
        createdAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
        updatedAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
      },
      {
        _id: new mongoose.Types.ObjectId(validateObjectId("671234567890123456789020", "Recipe Chowder _id")),
        restaurantId: restaurants[2]._id,
        name: "Seafood Chowder",
        items: [
          {
            ingredientId: ingredients[1]._id,
            quantity: 0.2,
            unit: ingredients[1].unit,
            costPerUnit: ingredients[1].price,
          },
          {
            ingredientId: ingredients[2]._id,
            quantity: 0.3,
            unit: ingredients[2].unit,
            costPerUnit: ingredients[2].price,
          },
        ],
        profitMargin: 35,
        salePrice: 0,
        servings: 4,
        createdAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
        updatedAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
      },
    ];

    const recipes = [];
    for (const recipe of recipeData) {
      const totalCost = recipe.items.reduce(
        (sum, item) => sum + item.quantity * item.costPerUnit,
        0
      );
      recipe.salePrice = totalCost / (1 - recipe.profitMargin / 100);
      const insertedRecipe = await db.collection("recipes").insertOne(recipe);
      recipes.push({ _id: insertedRecipe.insertedId, ...recipe });
      console.log(`Created Recipe: ${recipe.name} for Restaurant: ${restaurants.find(r => r._id.toString() === recipe.restaurantId.toString()).nameRes}`);
    }

    // Create Consumption History for each restaurant
    const consumptionHistories = [];
    for (const recipe of recipes) {
      const restaurant = restaurants.find(r => r._id.toString() === recipe.restaurantId.toString());
      if (!restaurant) {
        console.error(`Restaurant not found for recipe: ${recipe.name} with restaurantId: ${recipe.restaurantId}`);
        continue;
      }
      // Filter orders by orderNb range
      const restaurantOrders = orders.filter(o => {
        const index = restaurants.indexOf(restaurant);
        const minOrderNb = 1001 + index * 100;
        const maxOrderNb = 1002 + index * 100;
        return o.orderNb >= minOrderNb && o.orderNb <= maxOrderNb;
      });
      if (restaurantOrders.length === 0) {
        console.error(`No orders found for restaurant: ${restaurant.nameRes}`);
        continue;
      }
      const numEntries = Math.floor(Math.random() * 10) + 5;
      for (let j = 0; j < numEntries; j++) {
        const createdAt = getRandomDate(new Date("2025-01-01"), new Date("2025-04-28"));
        const item = recipe.items[Math.floor(Math.random() * recipe.items.length)];
        const consumption = new ConsumptionHistory({
          restaurantId: restaurant._id,
          ingredientId: item.ingredientId,
          ordreId: restaurantOrders[Math.floor(Math.random() * restaurantOrders.length)]._id,
          qty: item.quantity * (Math.random() * 2 + 0.5),
          createdAt: createdAt,
        });
        consumptionHistories.push(consumption);
        console.log(`Created ConsumptionHistory for Recipe ${recipe.name} in Restaurant: ${restaurant.nameRes}`);
      }
    }
    await ConsumptionHistory.insertMany(consumptionHistories);
    console.log(`Created ${consumptionHistories.length} consumption history entries`);

    // Create Invoices for each restaurant (5 per restaurant)
    const invoices = [];
    const invoiceItems = [];
    let invoiceItemIdCounter = 200; // Start at 200 for unique InvoiceItem _id
    let invoiceCounter = 1001;
    for (const restaurant of restaurants) {
      const restaurantSuppliers = suppliers.filter(s => s.restaurantId.toString() === restaurant._id.toString());
      const restaurantUser = users[restaurants.indexOf(restaurant)];
      for (let i = 0; i < 5; i++) {
        const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
        const invoiceItemsForThisInvoice = [];
        let invoiceTotal = 0;

        // Create InvoiceItems
        for (let j = 0; j < numItems; j++) {
          const ingredient = ingredients[Math.floor(Math.random() * ingredients.length)];
          const supplier = restaurantSuppliers[Math.floor(Math.random() * restaurantSuppliers.length)] || suppliers[0];
          const pricePerUnit = supplier.ingredients.find(si => si.ingredientId.toString() === ingredient._id.toString()).pricePerUnit;
          const quantity = Math.random() * 10 + 1; // 1-11 units
          const total = quantity * pricePerUnit;
          invoiceTotal += total;

          // Use fixed 24-character ObjectId
          const invoiceItemId = `67123456789012345678${(invoiceItemIdCounter++).toString().padStart(4, '0')}`;
          const invoiceItem = new InvoiceItem({
            _id: new mongoose.Types.ObjectId(validateObjectId(invoiceItemId, `InvoiceItem ${invoiceCounter}-${j} _id`)),
            invoice: null, // Set after invoice creation
            ingredient: ingredient._id, // Changed from ingredientId to ingredient
            quantity,
            pricePerUnit,
            total,
          });
          invoiceItemsForThisInvoice.push(invoiceItem);
        }

        // Create Invoice
        const status = Math.random() > 0.3 ? "pending" : "delivered";
        const invoiceId = `671234567890123456789${(i + restaurants.indexOf(restaurant) * 5).toString().padStart(3, '0')}`;
        const invoice = new Invoice({
          _id: new mongoose.Types.ObjectId(validateObjectId(invoiceId, `Invoice ${i} _id for ${restaurant.nameRes}`)),
          invoiceNumber: `INV-${invoiceCounter++}`,
          created_by: restaurantUser._id,
          restaurant: restaurant._id,
          supplier: restaurantSuppliers[Math.floor(Math.random() * restaurantSuppliers.length)]?._id || suppliers[0]._id,
          total: invoiceTotal,
          status,
          createdAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
          updatedAt: getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")),
          deliveredAt: status === "delivered" ? getRandomDate(new Date("2025-01-01"), new Date("2025-04-28")) : null,
        });
        invoices.push(invoice);

        // Update InvoiceItems with invoice ID
        invoiceItemsForThisInvoice.forEach(item => {
          item.invoice = invoice._id;
          invoiceItems.push(item);
        });

        console.log(`Created Invoice: ${invoice.invoiceNumber} for Restaurant: ${restaurant.nameRes}`);
      }
    }
    await Invoice.insertMany(invoices);
    await InvoiceItem.insertMany(invoiceItems);
    console.log(`Created ${invoices.length} invoices and ${invoiceItems.length} invoice items`);

    // Verification
    const categoryCount = await Category.countDocuments();
    const restaurantCount = await Restaurant.countDocuments();
    const ingredientCount = await Ingredient.countDocuments();
    const supplierCount = await Supplier.countDocuments();
    const orderCount = await Order.countDocuments();
    const userCount = await User.countDocuments();
    const recipeCount = await db.collection("recipes").countDocuments();
    const consumptionCount = await ConsumptionHistory.countDocuments();
    const invoiceCount = await Invoice.countDocuments();
    const invoiceItemCount = await InvoiceItem.countDocuments();
    console.log(`Total categories: ${categoryCount}`);
    console.log(`Total restaurants: ${restaurantCount}`);
    console.log(`Total ingredients: ${ingredientCount}`);
    console.log(`Total suppliers: ${supplierCount}`);
    console.log(`Total orders: ${orderCount}`);
    console.log(`Total users: ${userCount}`);
    console.log(`Total recipes: ${recipeCount}`);
    console.log(`Total consumption history entries: ${consumptionCount}`);
    console.log(`Total invoices: ${invoiceCount}`);
    console.log(`Total invoice items: ${invoiceItemCount}`);

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

seedData();