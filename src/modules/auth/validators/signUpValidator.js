const yup = require("yup");
// Validation schemas
const signupSchema = yup.object({
  firstName: yup.string().trim().required(),
  lastName: yup.string().trim().required(),
  email: yup.string().email("Invalid email").trim().lowercase().required(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required(),
  image: yup.string().optional(),
  phone: yup.string().required(),
  address: yup.string().required(),
  birthday: yup.date().required(),
  restaurant: yup.object({
    nameRes: yup.string().required("Restaurant name is required"),
    phone: yup.string().required("Phone is required"),
    address: yup.string().required("Address is required"),
    cuisineType: yup.string().required("Cuisine type is required"),
    taxeTPS: yup.number().min(0, "TPS tax must be 0 or greater"),
    taxeTVQ: yup.number().min(0, "TVQ tax must be 0 or greater"),
    color: yup.string(),
    logo: yup.string(),
    promotion: yup.string(),
    payCashMethod: yup.boolean(),
  }),
});
module.exports = { signupSchema };
