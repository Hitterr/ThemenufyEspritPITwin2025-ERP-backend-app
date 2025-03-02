require("dotenv").config();
require("module-alias/register");
const express = require("express");
const connectDB = require("./config/db");
const listEndpoints = require("express-list-endpoints");
const app = express();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
connectDB();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", require("@modules/auth/routes"));
// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	// Log all available routes
	console.log("\n📍 Available Routes:");
	const routes = listEndpoints(app);
	routes.forEach((route) => {
		console.log(`${route.methods.join(",")} ${route.path}`);
	});
});
