# Logistics Management System - Full Stack Application

## 🎉 Project Overview

A complete full-stack logistics management system with a beautiful, modern UI featuring role-based authentication and comprehensive CRUD operations for managing suppliers, warehouses, customers, items, vehicles, and drivers.

## 🚀 Features

### ✨ Frontend Features
- **Beautiful Dark Theme UI** with gradient animations and glassmorphism effects
- **Role-Based Authentication** (Admin, Manager, Driver)
- **Smooth Animations** - Sliding transitions, fade-ins, and hover effects
- **Responsive Design** - Works on all screen sizes
- **Modern Typography** - Using Inter font from Google Fonts
- **Interactive Dashboard** with sidebar navigation
- **Full CRUD Operations** for all entities

### 🔐 Authentication
- Login with username/password
- Quick login buttons for testing (Admin, Manager, Driver)
- JWT token-based authentication
- Session persistence with localStorage

### 📦 Entities Managed
1. **Suppliers** - Name, Phone, Email, Address
2. **Warehouses** - Name, Address, City
3. **Customers** - Name, Email, Phone, Address, Warehouse Assignment
4. **Items** - Name, Weight, Price, Warehouse, Supplier
5. **Vehicles** - License Plate, Model, Capacity
6. **Drivers** - Name, License, Phone, Vehicle Assignment

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **JWT** for authentication
- **CORS** enabled
- **dotenv** for environment variables

### Frontend
- **React** with Vite
- **Vanilla CSS** with custom design system
- **Google Fonts** (Inter)
- **Modern ES6+** JavaScript

## 📁 Project Structure

```
logistics_dbms/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── suppliers.js
│   │   ├── warehouses.js
│   │   ├── customers.js
│   │   ├── items.js
│   │   ├── vehicles.js
│   │   └── drivers.js
│   ├── .env
│   ├── db.js
│   ├── server.js
│   ├── initDb.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Login.css
    │   │   ├── Dashboard.jsx
    │   │   ├── Dashboard.css
    │   │   ├── Suppliers.jsx
    │   │   ├── Warehouses.jsx
    │   │   ├── Customers.jsx
    │   │   ├── Items.jsx
    │   │   ├── Vehicles.jsx
    │   │   ├── Drivers.jsx
    │   │   └── CrudModule.css
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

### Database Schema

**Users Table** (for authentication)
- id (SERIAL PRIMARY KEY)
- username (VARCHAR)
- password (VARCHAR)
- role (VARCHAR)

**Supplier Table**
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- phone (VARCHAR)
- email (VARCHAR)
- address (TEXT)

**Warehouse Table**
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- address (TEXT)
- city (VARCHAR)

**Customer Table**
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
- address (TEXT)
- warehouse_id (INTEGER FK)

**Item Table**
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- weight (DECIMAL)
- price (DECIMAL)
- warehouse_id (INTEGER FK)
- supplier_id (INTEGER FK)

**Vehicle Table**
- id (SERIAL PRIMARY KEY)
- license_plate (VARCHAR UNIQUE)
- model (VARCHAR)
- capacity (DECIMAL)

**Driver Table**
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- license (VARCHAR UNIQUE)
- phone (VARCHAR)
- vehicle_id (INTEGER FK)

## 🎨 Design System

### Color Palette
- **Primary**: #6366f1 (Indigo)
- **Secondary**: #ec4899 (Pink)
- **Accent**: #14b8a6 (Teal)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)

### Dark Theme
- Background: #0f172a → #1e293b gradient
- Cards: Glassmorphism with backdrop blur
- Text: #f8fafc (primary), #cbd5e1 (secondary)

### Animations
- Slide-up entrance animations
- Slide-right navigation animations
- Fade-in content transitions
- Floating gradient orbs on login
- Smooth hover effects


## 👤 Default Users

| Username | Password    | Role    |
|----------|-------------|---------|
| admin    | ********    | admin   |
| manager  | **********  | manager |
| driver   | *********   | driver  |

## 🎯 Usage

1. **Login** - Use quick login buttons or enter credentials
2. **Navigate** - Click sidebar items to switch between modules
3. **Create** - Click "Add [Entity]" button to open modal form
4. **Edit** - Click "Edit" button on any row
5. **Delete** - Click "Delete" button (with confirmation)
6. **Logout** - Click logout button in sidebar footer

## 🌟 Key Features Highlights

### Beautiful UI
- Modern dark theme with vibrant gradients
- Smooth animations throughout
- Glassmorphism effects on cards
- Floating gradient orbs on login page
- Premium color palette

### User Experience
- Intuitive navigation
- Quick login for testing
- Responsive modal forms
- Confirmation dialogs for destructive actions
- Loading states
- Error handling

### Data Relationships
- Customers linked to Warehouses
- Items linked to Warehouses and Suppliers
- Drivers linked to Vehicles
- Dropdown selects for foreign keys
