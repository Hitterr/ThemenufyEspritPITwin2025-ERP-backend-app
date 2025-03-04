const yup = require("yup");

const userSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: yup
    .string()
    .oneOf(["user", "admin", "superadmin", "employee", "client"])
    .default("user"),
  isEmailVerified: yup.boolean().default(false),
  verifiedDevices: yup.array().of(yup.string()).default([]),
  profilePicture: yup.string().nullable(),
  authProvider: yup
    .string()
    .oneOf(["local", "google", "facebook"])
    .default("local"),
});

module.exports = {
  userSchema,
};
