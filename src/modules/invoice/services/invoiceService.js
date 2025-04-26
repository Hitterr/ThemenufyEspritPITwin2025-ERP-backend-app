const Invoice = require("../../../models/invoice");
const InvoiceItem = require("../../../models/invoiceItem");
const invoiceItemService = require("./invoiceItemService");
const PriceHistory = require("../../../models/PriceHistory");
class InvoiceService {
	async createInvoice({
		userId,
		restaurant,
		supplier,
		items,
		status = "pending",
	}) {
		let invoice = new Invoice({
			created_by: userId,
			restaurant,
			supplier,
			status,
			invoiceNumber: Date.now().toString(),
			deliveredAt: status === "delivered" ? new Date() : null,
		});
		invoice = await invoice.save();
		// Create invoice items
		const itemPromises = items.map((item) =>
			InvoiceItem.create({
				invoice: invoice._id,
				...item,
			})
		);
		await Promise.all(itemPromises);
		items = await invoiceItemService.getItemsByInvoiceId(invoice._id);
		invoice.total = items.reduce((sum, item) => {
			const total = sum + item.price * item.quantity;
			console.log(total);
			return total;
		}, 0);
		invoice = await invoice.save();
		return { ...invoice._doc, items };
	}
	async getInvoices() {
		return Invoice.find()
			.populate("created_by", "firstName lastName email")
			.populate("restaurant")
			.populate("supplier");
	}
	async getInvoice(invoiceId) {
		const invoice = await Invoice.findById(invoiceId)
			.populate("created_by", "firstName lastName email")
			.populate("restaurant")
			.populate("supplier");
		if (!invoice) {
			throw new Error("Invoice not found");
		}
		const items = await InvoiceItem.find({ invoice: invoiceId }).populate(
			"ingredient",
			"libelle price"
		);
		return { ...invoice._doc, items };
	}
	async updateStatus(invoiceId, status) {
		const delivered = status.toLowerCase() == "delivered" ? new Date() : null;
		let invoice = await Invoice.findByIdAndUpdate(
			invoiceId,
			{ status, deliveredAt: delivered },
			{ new: true }
		);
		if (!invoice) {
			throw new Error("Invoice not found");
		}
		return invoice;
	}
	async deleteInvoice(invoiceId) {
		const invoice = await Invoice.findByIdAndDelete(invoiceId);
		if (!invoice) {
			throw new Error("Invoice not found");
		}
		//delete price histories of this invoice(invoiceid)
		await PriceHistory.deleteMany({ invoiceId: invoiceId });
		return invoice;
	}
}
module.exports = new InvoiceService();
