const yup = require("yup");
const { invoiceItemSchema } = require("./invoiceItemValidator");
const invoiceSchema = yup.object().shape({
	restaurant: yup.string().required("Restaurant ID is required"),
	supplier: yup.string().required("Supplier ID is required"),
	status: yup
		.string()
		.oneOf(["pending", "paid", "cancelled"])
		.default("pending"),
	items: yup
		.array(invoiceItemSchema)
		.min(1, "At least one item is required")
		.required("Items are required"),
});
const updateInvoiceStatusSchema = yup.object().shape({
	status: yup
		.string()
		.oneOf(["pending", "delivered", "cancelled"]) // Updated to match Invoice schema
		.required("Status is required"),
});
module.exports = {
	invoiceSchema,
	updateInvoiceStatusSchema,
};
