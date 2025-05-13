const yup = require("yup");
const invoiceItemSchema = yup.object().shape({
  stock: yup.string().optional(),
  quantity: yup
    .number()
    .positive("Quantity must be positive")
    .required("Quantity is required"),
  price: yup.number().positive("Price must be positive").optional(),
});
const updateInvoiceItemSchema = yup.object().shape({
  quantity: yup.number().positive("Quantity must be positive").optional(),
  price: yup.number().positive("Price must be positive").optional(),
});
module.exports = {
  invoiceItemSchema,
  updateInvoiceItemSchema,
};
