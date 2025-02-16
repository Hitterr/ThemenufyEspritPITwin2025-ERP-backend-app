require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();
// Connect to MongoDB
connectDB();
// Middleware
app.use(express.json());
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
