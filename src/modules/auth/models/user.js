const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, "Invalid email format"], // Email regex validation
		},
		password: {
			type: String,
			required: true,
			minlength: 6, // Ensures a minimum password length
		},
		role: {
			type: String,
			enum: ["admin", "superadmin", "staff", "manager"],
			default: "staff",
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true } // Adds `createdAt` & `updatedAt` automatically
);
// Index email for faster lookups
userSchema.index({ email: 1 });
// Export model
module.exports = mongoose.model("User", userSchema);
