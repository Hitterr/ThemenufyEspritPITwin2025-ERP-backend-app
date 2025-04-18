const yup = require("yup");

const invoiceItemSchema = yup.object().shape({
  ingredient: yup.string().required("Ingredient ID is required"),
  quantity: yup
    .number()
    .positive("Quantity must be positive")
    .required("Quantity is required"),
  description: yup.string().required("Description is required")
});

const updateInvoiceItemSchema = yup.object().shape({
  quantity: yup
    .number()
    .positive("Quantity must be positive"),
  description: yup.string()
});

module.exports = {
  invoiceItemSchema,
  updateInvoiceItemSchema
};