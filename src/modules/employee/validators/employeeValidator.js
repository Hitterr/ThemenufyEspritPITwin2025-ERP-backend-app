const yup = require("yup");

const employeeSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  salary: yup
    .number()
    .positive("Salary must be positive")
    .required("Salary is required"),
  restaurantFK: yup.string().required("Restaurant ID is required"),
  role: yup.string().default("employee")
});

module.exports = {
  employeeSchema
};