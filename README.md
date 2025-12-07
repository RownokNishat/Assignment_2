# 🚗 Vehicle Rental System API

A backend API for managing vehicle rentals, built with **Node.js, Express, and PostgreSQL**. This system handles vehicle inventory, customer profiles, and booking management with secure Role-Based Access Control (RBAC).

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Language:** TypeScript
* **Framework:** Express.js
* **Database:** PostgreSQL
* **Authentication:** JWT & Bcrypt

## 🌟 Key Features

* **Modular Architecture:** Code organized by features (Auth, Users, Vehicles, Bookings).
* **User Roles:** Secure `Admin` and `Customer` access levels.
* **Booking Logic:** Automated cost calculation and overlap validation.
* **Vehicle Inventory:** Real-time availability tracking.

git clone https://github.com/RownokNishat/Assignment_2
cd Assignment_2
npm install

# Development mode
npm run dev

# Production build
npm run build
npm start
📡 API Endpoints
Prefix: /api/v1

🔐 Authentication
POST /auth/signup - Register a new user

POST /auth/signin - Login and get Token

🚙 Vehicles
GET /vehicles - View all vehicles

POST /vehicles - Add vehicle (Admin)

PUT /vehicles/:id - Update vehicle (Admin)

DELETE /vehicles/:id - Delete vehicle (Admin)

📅 Bookings
POST /bookings - Create a rental booking

GET /bookings - View bookings (Admin: All, Customer: Own)

PUT /bookings/:id - Cancel or Return vehicle

👤 Users
GET /users - View all users (Admin)

PUT /users/:id - Update profile

DELETE /users/:id - Delete user (Admin)
