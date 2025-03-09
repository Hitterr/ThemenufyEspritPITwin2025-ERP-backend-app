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
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "superadmin", "employee", "client"],
      default: "admin",
    },
    isVerified: {
      type: Boolean,
      default: false,
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
    forgotPasswordVerif: {
      // Nested object for verification attributes
      resetCode: {
        type: String,
        required: false,
      },
      resetCodeExpires: {
        type: Date,
        required: false,
      },
      // verificationCode: {
      //   type: String,
      //   required: false,
      // },
      // verificationCodeExpires: {
      //   type: Date,
      //   required: false,
      // },
    },
  },
  { timestamps: true }
);

// Index email for faster lookups
userSchema.index({ email: 1 });

// Export model
module.exports = mongoose.model("User", userSchema);
