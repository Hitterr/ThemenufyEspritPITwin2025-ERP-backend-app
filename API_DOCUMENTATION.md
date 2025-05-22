# The Menufy Backend API Documentation

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Auth](#auth)
  - [User](#user)
  - [Employee](#employee)
  - [Super Admin](#super-admin)
  - [Restaurant](#restaurant)
  - [Admin](#admin)
  - [Storage](#storage)
  - [Waste](#waste)
  - [Supplier](#supplier)
  - [Invoice](#invoice)
  - [Supplier Comparison](#supplier-comparison)
  - [Categories](#categories)
  - [Filter](#filter)
  - [Stock](#stock)
  - [Recipe](#recipe)
  - [Supplier Order](#supplier-order)
  - [Forecasted Sales](#forecasted-sales)
  - [Chatbot](#chatbot)

## Overview

This documentation provides details about all available API endpoints in The Menufy Backend. The API follows RESTful principles and uses JSON for data exchange.

## Authentication

Most endpoints require authentication using JWT (JSON Web Token). Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

You can obtain a token by using the login endpoints.

## API Endpoints

### Auth

Base URL: `/api/auth`

#### Login

- **POST** `/email`

  - Login with email and password
  - Request body: `{ "email": "string", "password": "string" }`

- **POST** `/google`

  - Login with Google
  - Request body: `{ "token": "string" }`

- **POST** `/facebook`

  - Login with Facebook
  - Request body: `{ "token": "string" }`

- **GET** `/profile`

  - Get user profile
  - Requires: Authentication token

- **GET** `/verify-email/:token`

  - Verify email address
  - Params: `token` - Verification token

- **GET** `/verify-device/:token`
  - Verify device
  - Params: `token` - Device verification token

#### Signup

- **POST** `/`
  - Register a new user
  - Request body: User registration details

#### Profile

- **PUT** `/`

  - Update user profile
  - Requires: Authentication token
  - Request body: Updated profile information

- **PUT** `/password`
  - Update user password
  - Requires: Authentication token
  - Request body: `{ "currentPassword": "string", "newPassword": "string" }`

#### Device Management

- **DELETE** `/`

  - Remove devices
  - Requires: Authentication token

- **GET** `/:deviceId`
  - Check device
  - Requires: Authentication token
  - Params: `deviceId` - Device ID

### User

Base URL: `/api/users`

- **POST** `/`

  - Create a new user
  - Request body: User details

- **GET** `/`

  - Get all users

- **GET** `/:id`

  - Get user by ID
  - Params: `id` - User ID

- **PUT** `/:id`

  - Update user
  - Params: `id` - User ID
  - Request body: Updated user details

- **DELETE** `/:id`
  - Delete user
  - Params: `id` - User ID

### Employee

Base URL: `/api/employee`

- **GET** `/:id`

  - Get employee by ID
  - Params: `id` - Employee ID

- **POST** `/`

  - Create a new employee
  - Request body: Employee details

- **PUT** `/:id`

  - Update employee
  - Params: `id` - Employee ID
  - Request body: Updated employee details

- **DELETE** `/:id`
  - Delete employee
  - Params: `id` - Employee ID

### Super Admin

Base URL: `/api/superadmins`

- **POST** `/`

  - Create a super admin
  - Request body: Super admin details

- **GET** `/`

  - Get all super admins

- **GET** `/:id`

  - Get super admin by ID
  - Params: `id` - Super admin ID

- **PUT** `/:id`

  - Update super admin
  - Params: `id` - Super admin ID
  - Request body: Updated super admin details

- **PATCH** `/:id/archive`

  - Archive super admin
  - Params: `id` - Super admin ID

- **DELETE** `/:id/delete`
  - Delete archived super admin
  - Params: `id` - Super admin ID

### Restaurant

Base URL: `/api/restaurant`

- **POST** `/`

  - Create a restaurant
  - Request body: Restaurant details

- **GET** `/`

  - Get all restaurants

- **GET** `/:id`
  - Get restaurant by ID
  - Params: `id` - Restaurant ID

### Admin

Base URL: `/api/admin`

- **GET** `/restaurant/:restaurantId`

  - Get all admins for a restaurant
  - Params: `restaurantId` - Restaurant ID

- **GET** `/:id`

  - Get admin by ID
  - Params: `id` - Admin ID

- **POST** `/`

  - Create an admin
  - Request body: Admin details

- **PUT** `/:id`

  - Update admin
  - Params: `id` - Admin ID
  - Request body: Updated admin details

- **DELETE** `/:id`
  - Delete admin
  - Params: `id` - Admin ID

### Storage

Base URL: `/api/storage`

#### Consumptions

- **POST** `/consumptions`

  - Create consumption record
  - Request body: Consumption details

- **GET** `/consumptions`
  - Get consumption records

#### Trends

- **GET** `/trends/daily`

  - Get daily trends

- **GET** `/trends`
  - Get price histories

#### Prices

- **POST** `/Prices`
  - Create price history
  - Request body: Price history details

### Waste

Base URL: `/api/waste`

- **GET** `/summary`

  - Get waste summary

- **GET** `/trends`

  - Get waste trends

- **GET** `/percentage`
  - Get waste percentage

### Supplier

Base URL: `/api/supplier`

- **GET** `/stats`

  - Get supplier statistics

- **GET** `/delivery-stats`

  - Get top suppliers by delivery time

- **POST** `/`

  - Create a supplier
  - Request body: Supplier details

- **GET** `/`
  - Get all suppliers

### Invoice

Base URL: `/api/invoice`

#### Invoices

- **GET** `/stats`

  - Get invoice statistics

- **POST** `/`

  - Create an invoice
  - Request body: Invoice details

- **GET** `/`

  - Get all invoices

- **GET** `/:invoiceId`

  - Get invoice by ID
  - Params: `invoiceId` - Invoice ID

- **DELETE** `/:invoiceId`

  - Delete invoice
  - Params: `invoiceId` - Invoice ID

- **PATCH** `/:invoiceId/status`
  - Update invoice status
  - Params: `invoiceId` - Invoice ID
  - Request body: `{ "status": "string" }`

#### Invoice Items

- **GET** `/:invoiceId/items`

  - Get invoice items
  - Params: `invoiceId` - Invoice ID

- **POST** `/:invoiceId/items`

  - Add invoice item
  - Params: `invoiceId` - Invoice ID
  - Request body: Invoice item details

- **PUT** `/items/:itemId`

  - Update invoice item
  - Params: `itemId` - Item ID
  - Request body: Updated invoice item details

- **DELETE** `/items/:itemId`
  - Delete invoice item
  - Params: `itemId` - Item ID

### Supplier Comparison

Base URL: `/api/suppliersComparaison`

- **GET** `/compare`

  - Compare suppliers
  - Query parameters: Comparison criteria

- **POST** `/process`
  - Process chatbot message
  - Request body: `{ "message": "string" }`

### Categories

Base URL: `/api/categories`

- **POST** `/`

  - Create a category
  - Request body: Category details

- **GET** `/`

  - Get all categories

- **POST** `/sub-category`

  - Add sub-category
  - Request body: Sub-category details

- **PUT** `/sub-category`

  - Remove sub-category
  - Request body: Sub-category details

- **GET** `/:id`

  - Get category by ID
  - Params: `id` - Category ID

- **PUT** `/:id`

  - Update category
  - Params: `id` - Category ID
  - Request body: Updated category details

- **DELETE** `/:id`
  - Delete category
  - Params: `id` - Category ID

### Filter

Base URL: `/api/filter`

- **GET** `/`
  - Filter invoices
  - Requires: Authentication token
  - Query parameters: Filter criteria

### Stock & Ingredients

Base URL: `/api/stock`

- **GET** `/:stockId/suppliers`

  - Get suppliers for stock
  - Params: `stockId` - Stock ID

- **POST** `/`

  - Create stock
  - Request body: Stock details

- **GET** `/`

  - Get all stocks

- **GET** `/stats`

  - Get stock analysis

- **GET** `/:id`

  - Get stock by ID
  - Params: `id` - Stock ID

- **PUT** `/:id`

  - Update stock
  - Params: `id` - Stock ID
  - Request body: Updated stock details

- **DELETE** `/:id`

  - Delete stock
  - Params: `id` - Stock ID

- **PATCH** `/:id/increase`

  - Increase stock quantity
  - Params: `id` - Stock ID
  - Request body: `{ "amount": number }`

- **PATCH** `/:id/decrease`

  - Decrease stock quantity
  - Params: `id` - Stock ID
  - Request body: `{ "amount": number }`

- **GET** `/:stockId/qrcode`

  - Generate QR code for stock
  - Params: `stockId` - Stock ID

- **GET** `/:stockId/qrcode/scan`
  - Get stock by QR code
  - Params: `stockId` - Stock ID

### Recipe

Base URL: `/api/recipe`

- **GET** `/`
  - Get all recipes

### Supplier Order

Base URL: `/api/supplier-orders`

- **GET** `/purchase-order/:restaurantId`
  - Generate purchase order
  - Params: `restaurantId` - Restaurant ID

### Forecasted Sales

Base URL: `/api/stocks/forecast-auto`

- **GET** `/auto`
  - Get predicted stocks

### Chatbot

Base URL: `/api/chatbot`

- **POST** `/process`
  - Process chatbot message
  - Request body: `{ "message": "string" }`
