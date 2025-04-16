const yup = require("yup");

const invoiceItemSchema = yup.object().shape({
  ingredientId: yup.string().required("Ingredient ID is required"),
  quantity: yup
    .number()
    .positive("Quantity must be positive")
    .required("Quantity is required"),
  description: yup.string().required("Description is required"),
});

const invoiceSchema = yup.object().shape({
  items: yup
    .array()
    .of(invoiceItemSchema)
    .min(1, "At least one item is required")
    .required("Items are required"),
});

module.exports = {
  invoiceSchema,
  invoiceItemSchema,
};
