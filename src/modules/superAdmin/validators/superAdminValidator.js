const yup = require("yup");

const superAdminSchema = yup.object({
  name: yup.
  string().required("name is required"),

    email: yup.
    string().email("Invalid email").required("Email is required"),
  
  password: yup.
  string()
  .min(6, "Password must be at least 6 characters")
  .required("Password is required"),});

module.exports = { superAdminSchema };
