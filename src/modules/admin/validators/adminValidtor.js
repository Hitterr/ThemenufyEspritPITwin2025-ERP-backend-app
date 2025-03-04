const yup = require("yup");

const adminSchema = yup.object({
  firstName: yup.string().required("First name is required"),

  lastName: yup.string().required("Last name is required"),

  email: yup.string().email("Invalid email").required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  role: yup
    .string()
    .oneOf(["admin", "superadmin", "staff", "manager"], "Invalid role")
    .required("Role is required"),

  restaurant: yup.string().optional(),

  isVerified: yup.boolean().default(false),
});

module.exports = {
  adminSchema,
};
