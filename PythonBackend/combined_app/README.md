# The Menufy Backend API Documentation

This document provides information about the endpoints available in the combined Python backend application for The Menufy.

## Table of Contents

- [Overview](#overview)
- [Available Endpoints](#available-endpoints)
  - [Main Endpoint](#main-endpoint)
  - [Face Recognition API](#face-recognition-api)
  - [Stock Price Prediction API](#stock-price-prediction-api)
  - [Invoice Smart API](#invoice-smart-api)
  - [Consumption Prediction API](#consumption-prediction-api)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Dependencies](#dependencies)

## Overview

The Menufy Backend is a combined Flask application that integrates multiple services:

- Face Recognition for user authentication
- Stock Price Prediction for inventory management
- Invoice Smart for anomaly detection
- Consumption Prediction for forecasting

## Available Endpoints

### Main Endpoint

#### GET /

Returns the status of the API and lists available services.

**Response:**

```json
{
  "status": "online",
  "services": [
    "Face Recognition API",
    "Stock Price Prediction API",
    "Invoice Smart API",
    "Consumption Prediction API"
  ]
}
```

### Face Recognition API

#### POST /face/register

Registers a user's face for future recognition.

**Request:**

- Form data:
  - `user_id`: MongoDB ObjectId of the user
  - `image`: Image file containing the user's face

**Response (success):**

```json
{
  "status": "registered",
  "user_id": "<user_id>"
}
```

**Response (error):**

```json
{
  "error": "<error_message>"
}
```

#### POST /face/recognize

Recognizes a user from a face image.

**Request:**

- Form data:
  - `image`: Image file containing the user's face
  - `deviceId`: ID of the device making the request

**Response (success):**

```json
{
  "status": "recognized",
  "user_id": "<user_id>",
  "firstName": "<first_name>",
  "lastName": "<last_name>",
  "token": "<jwt_token>"
}
```

**Response (failure):**

```json
{
  "status": "unknown"
}
```

**Response (error):**

```json
{
  "error": "<error_message>"
}
```

### Stock Price Prediction API

#### GET /stock/predict

Predicts future stock prices based on historical data.

**Request Parameters:**

- `stockId`: MongoDB ObjectId of the stock
- `restaurantId`: MongoDB ObjectId of the restaurant
- `days`: Number of days ahead to predict (default: 7)

**Response:**

```json
{
  "stockId": "<stock_id>",
  "restaurantId": "<restaurant_id>",
  "predicted_price": 45.75,
  "confidence": 85.2,
  "predicted_date": "2023-12-31T00:00:00Z"
}
```

#### GET /stock/volatility

Gets the volatility classification for a stock.

**Request Parameters:**

- `stockId`: MongoDB ObjectId of the stock
- `restaurantId`: MongoDB ObjectId of the restaurant

**Response:**

```json
{
  "stockId": "<stock_id>",
  "restaurantId": "<restaurant_id>",
  "volatility_class": "medium",
  "confidence": 0.85
}
```

### Invoice Smart API

#### POST /invoice/detect-spike

Detects price spikes in invoices compared to historical prices.

**Request:**

```json
{
  "stockId": "<stock_id>",
  "price": 100.0
}
```

**Response:**

```json
{
  "success": true,
  "message": "Spike detection endpoint",
  "data": {
    "stockId": "<stock_id>",
    "price": 100.0
  }
}
```

### Consumption Prediction API

#### POST /predict/consumption

Predicts future consumption based on historical data.

**Request:**

```json
{
  "stockId": "<stock_id>",
  "days": 7,
  "startDate": "2023-01-01T00:00:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "stockId": "<stock_id>",
  "days": 7,
  "predictions": [
    { "ds": "Mon, 01 Jan 2023 00:00:00 GMT", "yhat": 10.5 },
    { "ds": "Tue, 02 Jan 2023 00:00:00 GMT", "yhat": 12.3 }
  ],
  "totalForecastedQty": 75.25,
  "currentStock": 50,
  "unit": "kg",
  "price": 15.99,
  "missingQty": 25.25
}
```

## Running the Application

### Using Docker

```bash
docker-compose up -d
```

### Manual Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Set up environment variables (see [Environment Variables](#environment-variables))

3. Run the application:

```bash
python app.py
```

## Project Structure

```
combined_app/
├── .env                  # Environment variables
├── app.py                # Main application entry point
├── config.py             # Configuration settings
├── docker-compose.yml    # Docker configuration
├── requirements.txt      # Python dependencies
└── services/             # Service modules
    ├── __init__.py
    ├── face_recognition_service.py
    ├── invoice_service.py
    ├── prediction_service.py
    └── stock_price_service.py
```

## Environment Variables

The application uses the following environment variables:

- `MONGO_URI`: MongoDB connection string (default: "mongodb://host.docker.internal:27017/the-menufy")
- `JWT_SECRET_KEY`: Secret key for JWT token generation (default: "TheMenufy@ERP")
- `PORT`: Port to run the application (default: 5000)
- `ALLOWED_EXTENSIONS`: Allowed file extensions for uploads (default: "png,jpg,jpeg")
- `UPLOAD_FOLDER`: Directory for file uploads (default: "uploads")

## Dependencies

Main dependencies include:

- Flask
- flask-cors
- pymongo
- numpy
- pandas
- scikit-learn
- xgboost
- statsmodels
- prophet
- face-recognition
- opencv-python
- python-dotenv
- PyJWT
- Werkzeug

For a complete list, see the `requirements.txt` file.
