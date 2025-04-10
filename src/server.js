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
    origin: "http://localhost:5173", // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"], // Allow specific methods
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
// Start server
const http = require("http");
const { initSocket } = require("./config/socket");
// Create HTTP server
const server = http.createServer(app);
// Initialize Socket.IO
initSocket(server);

app.use("/api/supplier", require("@modules/supplier"));

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
