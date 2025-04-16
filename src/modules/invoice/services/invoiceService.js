const Invoice = require("../../../models/invoice");
const User = require("../../../models/user");
const Ingredient = require("../../../models/ingredient");

class InvoiceService {
  async createInvoice(userId, items) {
    try {
      // Get user details
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Process items and calculate total
      const invoiceItems = await Promise.all(
        items.map(async (item) => {
          const ingredient = await Ingredient.findById(item.ingredientId);
          if (!ingredient) {
            throw new Error(`Ingredient not found: ${item.ingredientId}`);
          }

          return {
            ingredient: ingredient._id,
            quantity: item.quantity,
            price: ingredient.price,
            description: item.description,
          };
        })
      );

      const totalAmount = invoiceItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Create invoice
      const invoice = new Invoice({
        user: userId,
        items: invoiceItems,
        totalAmount,
      });

      await invoice.save();

      // Populate user and ingredient details
      return await Invoice.findById(invoice._id)
        .populate("user", "name email phone")
        .populate("items.ingredient", "name");
    } catch (error) {
      throw error;
    }
  }

  async getInvoice(invoiceId) {
    try {
      const invoice = await Invoice.findById(invoiceId)
        .populate("user", "name email phone")
        .populate("items.ingredient", "name");

      if (!invoice) {
        throw new Error("Invoice not found");
      }

      return invoice;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new InvoiceService();
