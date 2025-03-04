require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../../modules/auth/models/user");
const users = require("./userSeeds");
const { hashPassword } = require("../../utils/hash");
const seedDatabase = async () => {
	try {
		// Connect to MongoDB
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB...");
		// Clear existing data
		await User.deleteMany({});
		console.log("Cleared existing users...");
		// Hash passwords and prepare user data
		const usersWithHashedPasswords = await Promise.all(
			users.map(async (user) => ({
				...user,
				password: await hashPassword(user.password),
				createdAt: new Date(),
				updatedAt: new Date(),
			}))
		);
		// Insert users
		await User.insertMany(usersWithHashedPasswords);
		console.log("Users seeded successfully!");
		// Disconnect from MongoDB
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
};
seedDatabase();
