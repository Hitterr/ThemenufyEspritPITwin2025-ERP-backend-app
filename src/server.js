require("dotenv").config();
require("module-alias/register");
const express = require("express");
const connectDB = require("./config/db");
const listEndpoints = require("express-list-endpoints");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
connectDB();
// Middleware
app.use(
  cors({
    origin: "*", // Allow only this origin
    methods: "*", // Allow specific methods
    credentials: true, // Allow cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", require("@modules/auth/routes"));
app.use("/api/user", require("@modules/user/routes"));
app.use("/api/employee", require("@modules/employee"));
app.use("/api/superadmins", require("@modules/superAdmin"));
app.use("/api/restaurant", require("@modules/restaurant"));
app.use("/api/admin", require("@modules/admin"));
app.use("/api/ingredient", require("@modules/ingredient"));
app.use("/api/storage", require("@modules/storage"));
app.use("/api/waste", require("@modules/waste/routes/wasteRoutes"));
app.use("/api/supplier", require("@modules/supplier/routes/supplierRoutes"));
app.use("/api/invoice", require("@modules/invoice"));
app.use(
  "/api/chatbot",
  require("./modules/supplierComparaison/routes/chatbotRoute")
);
app.use("/api/suppliersComparaison", require("@modules/supplierComparaison"));
app.use("/api/categories", require("@modules/category"));
app.use("/api/filter", require("@modules/filterCriteria"));
app.use(
  "/api/ingredients/forecast-auto",
  require("@modules/forecastedSales/routes/forecastRoutes")
);
app.use("/api/stock", require("@modules/stock"));
// Start server
app.use("/api/recipe", require("@modules/recipe/routes/recipeRoutes"));
const http = require("http");
const { initSocket } = require("./config/socket");
// Create HTTP server
const server = http.createServer(app);
// Initialize Socket.IO
initSocket(server);
// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  logAvailableRoutes();
});
// Remove the duplicate exports and keep only this one
module.exports = app;
const logAvailableRoutes = () => {
  // Log all available routes
  const routes = listEndpoints(app);
  const moduleRoutes = {};
  routes.forEach((route) => {
    const moduleName = route.path.split("/")[2]; // Get module name from path
    if (!moduleRoutes[moduleName]) {
      moduleRoutes[moduleName] = [];
    }
    moduleRoutes[moduleName].push({
      method: route.methods.join(","),
      path: route.path,
    });
  });
  // Display routes by module
  console.clear();
  console.log("\n📍 API Routes by Module:");
  Object.keys(moduleRoutes).forEach((module) => {
    console.log(`\n🔹 ${module.toUpperCase()} Module:`);
    moduleRoutes[module].forEach((route) => {
      console.log(`\t⚡${route.method} http://localhost:${PORT}${route.path}`);
    });
  });
};
