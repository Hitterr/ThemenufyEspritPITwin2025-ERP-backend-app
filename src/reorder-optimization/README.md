# Dynamic Reorder Optimization

This feature calculates optimal reorder times and quantities for stock items based on forecasted demand, shelf life, and supplier lead times.

## Structure
- `routes/reorder.js`: API routes for reorder recommendations.
- `controllers/reorderController.js`: Logic to call the Python script for demand forecasting and reorder calculations.
- `scripts/reorder.py`: Python script using Prophet for demand forecasting and reorder calculations.

## Setup

### Prerequisites
- **Node.js**: Ensure Node.js is installed (version 14.x or higher recommended). Verify with `node -v`.
- **Python**: Ensure Python 3.x is installed and added to the system's PATH. Verify with `python --version` or `python3 --version`. If `python` does not work, use `python3` (this may vary by operating system).
- **MongoDB**: Ensure MongoDB is installed and running on `mongodb://localhost:27017/` (default). If using a remote MongoDB instance, update the connection string in `scripts/reorder.py`.

pip install -r requirements.txt
### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>