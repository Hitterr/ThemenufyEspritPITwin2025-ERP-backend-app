# Invoice Module Documentation

## Overview

The invoice module handles the creation, management, and tracking of invoices within the system. It includes functionality for creating invoices, adding/updating/removing invoice items, and updating invoice status.

## Features

- Create new invoices with multiple items
- Manage invoice items (add, update, delete)
- Update invoice status (pending, paid, cancelled)
- View detailed invoice information
- Automatic total calculation

## Models

### Invoice

- `user`: Reference to the user who created the invoice
- `restaurant`: Reference to the associated restaurant
- `supplier`: Reference to the supplier
- `invoiceNumber`: Unique identifier for the invoice
- `status`: Current status (pending, paid, cancelled)
- `total`: Calculated total amount

### InvoiceItem

- `invoice`: Reference to the parent invoice
- `ingredient`: Reference to the ingredient
- `quantity`: Quantity of the ingredient
- `price`: Unit price (optional, can be inherited from ingredient)
- `description`: Additional description (optional)

## API Endpoints

### Invoices

- `POST /invoices` - Create a new invoice

  - Requires: `restaurant`, `supplier`, `items`
  - Example Request Body:
    ```json
    {
      "restaurant": "64c8f1a2b4d5e6f7a8b9c0d1",
      "supplier": "64c8f1a2b4d5e6f7a8b9c0d2",
      "items": [
        {
          "ingredient": "64c8f1a2b4d5e6f7a8b9c0d3",
          "quantity": 10
        }
      ]
    }
    ```

- `GET /invoices` - Get all invoices
- `GET /invoices/:invoiceId` - Get specific invoice details
- `PATCH /invoices/:invoiceId/status` - Update invoice status
  - Requires: `status`
  - Example Request Body:
    ```json
    {
      "status": "paid"
    }
    ```

### Invoice Items

- `POST /invoices/:invoiceId/items` - Add item to invoice

  - Requires: `ingredientId`, `quantity`
  - Example Request Body:
    ```json
    {
      "ingredientId": "64c8f1a2b4d5e6f7a8b9c0d3",
      "quantity": 5
    }
    ```

- `PUT /invoices/items/:itemId` - Update invoice item

  - Optional: `quantity`, `description`
  - Example Request Body:
    ```json
    {
      "quantity": 8
    }
    ```

- `DELETE /invoices/items/:itemId` - Delete invoice item

## Validation

### Invoice Schema

- `restaurant`: Required string
- `supplier`: Required string
- `status`: Must be one of ["pending", "paid", "cancelled"]
- `items`: Array of at least one valid invoice item

### InvoiceItem Schema

- `ingredient`: Required string
- `quantity`: Required positive number
- `price`: Optional positive number

## Services

### InvoiceService

<mcsymbol name="createInvoice" filename="invoiceService.js" path="src\modules\invoice\services\invoiceService.js" startline="5" type="function"></mcsymbol>
<mcsymbol name="getInvoices" filename="invoiceService.js" path="src\modules\invoice\services\invoiceService.js" startline="28" type="function"></mcsymbol>
<mcsymbol name="getInvoice" filename="invoiceService.js" path="src\modules\invoice\services\invoiceService.js" startline="35" type="function"></mcsymbol>
<mcsymbol name="updateStatus" filename="invoiceService.js" path="src\modules\invoice\services\invoiceService.js" startline="53" type="function"></mcsymbol>

### InvoiceItemService

<mcsymbol name="addItem" filename="invoiceItemService.js" path="src\modules\invoice\services\invoiceItemService.js" startline="5" type="function"></mcsymbol>
<mcsymbol name="updateItem" filename="invoiceItemService.js" path="src\modules\invoice\services\invoiceItemService.js" startline="21" type="function"></mcsymbol>
<mcsymbol name="deleteItem" filename="invoiceItemService.js" path="src\modules\invoice\services\invoiceItemService.js" startline="36" type="function"></mcsymbol>

## Error Handling

All endpoints return appropriate HTTP status codes and error messages in the following format:

```json
{
  "success": false,
  "message": "Error message"
}
```

# Ingredient Module Documentation

## Overview

The ingredient module manages all aspects of ingredient inventory, including creation, updates, quantity management, and alerts for low stock levels.

## Features

- Create and manage ingredient details
- Update ingredient quantities (increase/decrease)
- Real-time stock level monitoring
- Automatic alerts for low stock levels
- Validation of ingredient data
- Real-time updates via WebSocket

## Models

### Ingredient

- `libelle`: Name of the ingredient (required)
- `quantity`: Current stock quantity (required, positive number)
- `type`: Type/category of ingredient (required)
- `price`: Unit price (required, positive number)
- `disponibility`: Availability status (default: true)
- `maxQty`: Maximum stock quantity (required, positive number)
- `minQty`: Minimum stock quantity (required, positive number)
- `unit`: Measurement unit (required)

## API Endpoints

### Ingredients

- `POST /ingredients` - Create a new ingredient

  - Requires: Valid ingredient data
  - Example Request Body:
    ```json
    {
      "libelle": "Tomato",
      "quantity": 100,
      "type": "Vegetable",
      "price": 0.5,
      "maxQty": 500,
      "minQty": 50,
      "unit": "kg"
    }
    ```

- `GET /ingredients` - Get all ingredients
- `GET /ingredients/:id` - Get specific ingredient details
- `PUT /ingredients/:id` - Update ingredient details
- `DELETE /ingredients/:id` - Delete an ingredient

### Quantity Management

- `PATCH /ingredients/:id/increase` - Increase ingredient quantity

  - Requires: `amount` (positive number)
  - Example Request Body:
    ```json
    {
      "amount": 50
    }
    ```

- `PATCH /ingredients/:id/decrease` - Decrease ingredient quantity
  - Requires: `amount` (positive number)
  - Example Request Body:
    ```json
    {
      "amount": 25
    }
    ```

## Validation

### Ingredient Schema

- `libelle`: Required string
- `quantity`: Required positive number
- `type`: Required string
- `price`: Required positive number
- `maxQty`: Required positive number
- `minQty`: Required positive number
- `unit`: Required string

## Services

### IngredientService

<mcsymbol name="createIngredient" filename="ingredientService.js" path="src\modules\ingredient\services\ingredientService.js" startline="7" type="function"></mcsymbol>
<mcsymbol name="updateIngredient" filename="ingredientService.js" path="src\modules\ingredient\services\ingredientService.js" startline="18" type="function"></mcsymbol>
<mcsymbol name="increaseQuantity" filename="ingredientService.js" path="src\modules\ingredient\services\ingredientService.js" startline="35" type="function"></mcsymbol>
<mcsymbol name="decreaseQuantity" filename="ingredientService.js" path="src\modules\ingredient\services\ingredientService.js" startline="50" type="function"></mcsymbol>

## WebSocket Events

- `ingredient-update`: Emitted when ingredient details are updated
- `ingredient-alert`: Emitted when stock level falls below minimum quantity

## Error Handling

All endpoints return appropriate HTTP status codes and error messages in the following format:

```json
{
  "success": false,
  "message": "Error message"
}
```
