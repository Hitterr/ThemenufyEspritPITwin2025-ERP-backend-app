const yup = require("yup");

const invoiceSchema = yup.object().shape({
  restaurant: yup.string().required("Restaurant ID is required"),
  supplier: yup.string().required("Supplier ID is required"),
  status: yup
    .string()
    .oneOf(["pending", "paid", "cancelled"])
    .default("pending"),
  items: yup
    .array()
    .min(1, "At least one item is required")
    .required("Items are required")
});

const updateInvoiceStatusSchema = yup.object().shape({
  status: yup
    .string()
    .oneOf(["pending", "paid", "cancelled"])
    .required("Status is required")
});

module.exports = {
  invoiceSchema,
  updateInvoiceStatusSchema
};
