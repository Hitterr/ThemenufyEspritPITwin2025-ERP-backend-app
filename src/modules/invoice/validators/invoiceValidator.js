const yup = require("yup");
const { invoiceItemSchema } = require("./invoiceItemValidator");
const invoiceSchema = yup.object().shape({
  restaurant: yup.string().required("Restaurant ID is required"),
  supplier: yup.string().required("Supplier ID is required"),
  status: yup
    .string()
    .oneOf(["pending", "paid", "cancelled"])
    .default("pending"),
  paidStatus: yup.string().oneOf(["paid", "nopaid"]).default("nopaid"),

  items: yup
    .array(invoiceItemSchema)
    .min(1, "At least one item is required")
    .required("Items are required"),
});
const updateInvoiceStatusSchema = yup.object().shape({
  status: yup
    .string()
    .oneOf(["pending", "delivered", "cancelled"])
    .default("pending"),
});
const updateInvoicePaidStatusSchema = yup.object().shape({
  paidStatus: yup.string().oneOf(["paid", "nopaid"]).default("noPaid"),
});
module.exports = {
  invoiceSchema,
  updateInvoiceStatusSchema,
  updateInvoicePaidStatusSchema,
};
