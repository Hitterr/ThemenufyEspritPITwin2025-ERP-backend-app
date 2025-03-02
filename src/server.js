require("dotenv").config();
require("module-alias/register");
const express = require("express");
const connectDB = require("./config/db");
const { sendVerificationEmail } = require("./utils/mailing");
const app = express();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
connectDB();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
// TODO: Add your routes here
app.use("/api/auth", require("@modules/auth/routes"));
// app.use('/api/users', require('@modules/user/routes'));
// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
