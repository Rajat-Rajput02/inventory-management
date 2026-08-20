# 📦 Inventory Management System

A full-stack Inventory Management System built to manage products, categories, suppliers, warehouses, stock transactions, users, and inventory reports through a modern and responsive web application.

The application includes JWT-based authentication, role-based authorization, dashboard analytics, stock management, reporting, Excel/PDF exports, user management, and cloud-based image handling.

---

## 🚀 Live Application

### Frontend
https://inventory-management-project-gamma.vercel.app

### Backend API
https://inventory-management-api-5n6x.onrender.com

---

## 📌 Project Overview

The Inventory Management System provides a centralized platform for managing inventory operations.

Users can:

- Manage products
- Manage categories
- Manage suppliers
- Manage warehouses
- Track stock IN/OUT transactions
- Monitor low-stock products
- View dashboard analytics
- Generate inventory reports
- Export reports to Excel and PDF
- Manage their profile
- Change their password

Administrators can additionally:

- View users
- Change user roles
- Activate/deactivate users

---

# ✨ Features

## 🔐 Authentication & Authorization

- User registration
- User login
- JWT-based authentication
- Protected frontend routes
- Protected backend APIs
- Role-based authorization
- Active/inactive user verification
- Password hashing
- Automatic JWT attachment to API requests

---

## 📊 Dashboard

The dashboard provides an overview of the inventory system including:

- Total products
- Inventory statistics
- Low-stock information
- Category analytics
- Stock analytics
- Recent activities
- Quick actions

The dashboard dynamically retrieves the required inventory data from the backend.

---

## 📦 Product Management

Users can:

- Add products
- View products
- Edit products
- Delete products
- Search products
- Filter products
- Monitor product quantity
- Configure minimum stock levels
- Identify low-stock products
- Perform stock IN transactions
- Perform stock OUT transactions

---

## 🗂️ Category Management

- Add categories
- Edit categories
- Delete categories
- View categories
- Associate products with categories

---

## 🚚 Supplier Management

- Add suppliers
- Edit suppliers
- Delete suppliers
- View supplier information
- Associate suppliers with inventory

---

## 🏢 Warehouse Management

- Add warehouses
- Edit warehouses
- Delete warehouses
- View warehouse information
- Associate inventory with warehouses

---

## 🔄 Stock Transactions

The system supports inventory movement through:

### Stock IN

Adds inventory quantity to a product.

### Stock OUT

Removes inventory quantity from a product.

Transactions can include:

- Product
- Transaction type
- Quantity
- Unit price
- Reason
- Notes

Transaction history can be reviewed from the application.

---

## ⚠️ Low Stock Management

Products are automatically identified based on their minimum stock threshold.

Example:

```text
Product Quantity = 5
Minimum Stock = 10

Status = Low Stock
