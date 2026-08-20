# 📦 Inventory Management System

A full-stack **Inventory Management System** built using the MERN stack to manage products, categories, suppliers, warehouses, stock transactions, users, reports, and inventory activities through a modern and responsive dashboard.

The application provides role-based access, JWT authentication, inventory tracking, low-stock monitoring, analytics, reporting, Excel/PDF exports, and a responsive Material UI interface.

---

## 🚀 Live Demo

### Frontend
https://inventory-management-project-gamma.vercel.app

### Backend API
https://inventory-management-api-5n6x.onrender.com

> Note: The backend is deployed separately from the frontend. The frontend communicates with the backend through REST APIs.

---

# 📸 Project Overview

The Inventory Management System provides a centralized platform for managing inventory operations.

Users can:

- Manage products
- Manage categories
- Manage suppliers
- Manage warehouses
- Track stock IN/OUT transactions
- Monitor low-stock products
- View inventory analytics
- Generate reports
- Export inventory data to Excel and PDF
- Print inventory reports
- Manage user profiles
- Manage users and roles
- Monitor system activities
- Configure application settings

---

# ✨ Key Features

## 🔐 Authentication & Authorization

- User registration
- User login
- JWT-based authentication
- Protected routes
- Public routes
- Automatic JWT attachment to API requests
- Role-based access control
- Admin-only user management
- Active/inactive user status
- Password change functionality
- Profile management

---

## 📊 Dashboard

The dashboard provides an overview of the current inventory state.

### Dashboard includes:

- Total products
- Total inventory value
- Low-stock products
- Categories overview
- Stock analytics
- Category-wise charts
- Stock-level charts
- Recent activities
- Quick actions
- Inventory export options

The dashboard loads the data it requires through APIs while the application uses route-based code splitting for better initial loading performance.

---

## 📦 Product Management

Users can:

- Add products
- Edit products
- Delete products
- View product details
- Search products
- Filter products
- Track product quantity
- Configure minimum stock levels
- Monitor product status
- Perform stock IN transactions
- Perform stock OUT transactions

Product status can be determined based on inventory quantity:

- In Stock
- Low Stock
- Out of Stock

---

## 🏷️ Category Management

- Create categories
- Update categories
- Delete categories
- View category information
- Associate products with categories

---

## 🚚 Supplier Management

- Add suppliers
- Update suppliers
- Delete suppliers
- View supplier information
- Associate suppliers with products

---

## 🏢 Warehouse Management

- Add warehouses
- Update warehouses
- Delete warehouses
- View warehouse information
- Associate inventory with warehouses

---

## 🔄 Stock Transactions

The system supports inventory movement through:

### Stock IN

Used when inventory is received or added.

### Stock OUT

Used when inventory is sold, issued, transferred, or removed.

Each transaction can contain:

- Product
- Transaction type
- Quantity
- Unit price
- Reason
- Notes

Transactions automatically refresh the product inventory data.

---

## 📈 Reports & Analytics

The Reports module provides filtered inventory analysis.

Users can filter inventory by:

- Category
- Supplier
- Warehouse
- Stock status
- Start date
- End date

### Report statistics include:

- Visible products
- Low-stock products
- Categories
- Inventory value

### Visualizations

- Category distribution chart
- Stock-level chart

---

## 📄 Export & Printing

Inventory reports can be exported in multiple formats.

### Excel

Generate multi-sheet Excel reports containing inventory information.

### PDF

Generate formatted PDF reports containing:

- Executive summary
- Product details
- Inventory values
- Stock status
- Report date
- Generated user
- Page numbering

### Print

Inventory information can also be printed directly from the application.

---

## 👤 User Management

Administrators can:

- View users
- Update user roles
- Activate/deactivate users
- Manage user access

Users can:

- View their profile
- Update profile information
- Change password
- Upload profile avatar

---

## 📝 Activity Tracking

The application maintains activity information for important inventory operations.

This helps administrators monitor system activity and understand changes made within the application.

---

# 🛠️ Tech Stack

## Frontend

- React.js
- React Router
- Material UI (MUI)
- MUI DataGrid
- Axios
- Vite
- JavaScript
- jsPDF
- jspdf-autotable
- Excel export utilities
- Recharts / chart components

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary
- CORS
- dotenv

## Development Tools

- Git
- GitHub
- VS Code
- npm
- Nodemon

## Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database
- Cloudinary — Image storage

---

# 🏗️ Application Architecture

```text
                    ┌──────────────────────┐
                    │       User           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │      Vercel          │
                    └──────────┬───────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │       Render         │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │ MongoDB     │ │ Cloudinary  │ │ JWT Auth    │
        │ Atlas       │ │ Images      │ │ Security    │
        └─────────────┘ └─────────────┘ └─────────────┘
---------------------------------------------------------------------------
## 💻 Local Installation
### 1. Clone the Repository
        git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
 navigate into project 
        cd inventory-management
<img width="566" height="981" alt="image" src="https://github.com/user-attachments/assets/18ebd251-0c3c-47d9-b4e3-3a28faa3746c" />
-----------------------------------------------------------------------------
## API Overview
<img width="329" height="738" alt="image" src="https://github.com/user-attachments/assets/83b3396f-9b9e-4275-8b6e-2f05c942272a" />
------------------------------------------------------------------------------
## 🔐 Security

The application implements several security mechanisms:

JWT-based authentication
Protected frontend routes
Protected backend routes
Admin authorization middleware
Password hashing using bcrypt
Environment variables for sensitive credentials
CORS configuration
Authentication token validation
Active user status validation
Centralized backend error handling

JWT tokens are attached automatically to API requests using an Axios interceptor.
----------------------------------------------------------------------------------
##🔄 Authentication Flow
User
 │
 ▼
Login Form
 │
 ▼
POST /api/auth/login
 │
 ▼
Backend validates credentials
 │
 ▼
JWT Token Generated
 │
 ▼
Frontend stores token
 │
 ▼
Axios Interceptor
 │
 ▼
Authorization: Bearer <token>
 │
 ▼
Protected Backend Route
 │
 ▼
JWT Verification
 │
 ▼
User Loaded
 │
 ▼
Request Authorized
-----------------------------------------------------------------
## 📊 Dashboard Data Flow

The dashboard does not need to load every frontend page before displaying its information.

Instead, React route-based code splitting loads pages when their routes are accessed.

The Dashboard itself loads the data required for its own widgets through API calls/hooks.

For example:
Dashboard
   │
   ├── Product Data
   ├── Category Data
   ├── Supplier Data
   ├── Statistics
   ├── Activities
   └── Chart Data
-----------------------------------------------------------------------
##⚡ Performance Optimizations

The project includes several optimizations for production:

Route-based lazy loading
Code splitting
Vite production builds
Axios instance reuse
API request timeout
React hooks for optimized data handling
Memoized derived data
Responsive Material UI components
Separate frontend and backend deployment
Production environment variables

The application uses dynamic imports/code splitting to avoid loading every page's JavaScript bundle during the initial application load.
--------------------------------------------------------------------------
## 🗃️ Database

The application uses MongoDB as the primary database.

MongoDB Atlas can be used as the cloud database provider.

Main entities include:

Users
Products
Categories
Suppliers
Warehouses
Transactions
Activities
Notifications
Settings

Mongoose is used for:

Schema definitions
Data validation
Database queries
Relationships/references
Model management
---------------------------------------------------------------------------
## ☁️ Cloud Services
MongoDB Atlas

Used for cloud database hosting.

Cloudinary

Used for image/avatar storage.

Render

Used for backend API deployment.

Vercel

Used for frontend deployment.
-----------------------------------------------------------------------------
## 🚀 Deployment Architecture:-

                 Internet
                     │
                     ▼
          ┌─────────────────────┐
          │      Vercel         │
          │ React Frontend      │
          └──────────┬──────────┘
                     │
                     │ HTTPS REST API
                     ▼
          ┌─────────────────────┐
          │      Render         │
          │ Node + Express API  │
          └───────┬───────┬─────┘
                  │       │
                  ▼       ▼
          ┌──────────┐  ┌────────────┐
          │ MongoDB  │  │ Cloudinary │
          │  Atlas   │  │   Images   │
          └──────────┘  └────────────┘
------------------------------------------------------------------------------
## 📌 Project Highlights

This project demonstrates practical experience with:

Full-stack MERN development
REST API development
MongoDB database design
JWT authentication
Role-based authorization
React component architecture
React Router
Material UI
Data visualization
File/image uploads
Cloudinary integration
Excel/PDF report generation
API integration using Axios
Protected routes
Environment configuration
Production deployment
Git/GitHub workflow
Production debugging
Performance optimization
Code splitting
---------------------------------------------------------------------------
# 👨‍💻 Author

Rajat Kumar

MCA Graduate | Full-Stack Developer

##⭐ If you found this project useful

Consider giving the repository a ⭐ on GitHub.
