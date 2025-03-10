const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
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
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    image: {
      type: String,
      default: null,
    },
    phone: {
      type: Number,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    birthday: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "superadmin", "employee", "client"],
      default: "admin",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    verifiedDevices: [{ type: String }],
    verificationCode: { // Nouveau champ pour le code de vérification
      type: String,
      default: null,
    },
    verificationCodeExpires: { // Nouveau champ pour l'expiration du code
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index email for faster lookups
userSchema.index({ email: 1 });

// Export model
module.exports = mongoose.model("User", userSchema);