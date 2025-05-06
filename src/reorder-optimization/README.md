# Dynamic Reorder Optimization

This feature calculates optimal reorder times and quantities for stock items based on forecasted demand, shelf life, and supplier lead times.

## Structure
- `routes/reorder.js`: API routes for reorder recommendations.
- `controllers/reorderController.js`: Logic to call the Python script.
- `scripts/reorder.py`: Python script using Prophet for demand forecasting and reorder calculations.

## Setup
1. Install Node.js dependencies:
   ```bash
   npm install python-shell