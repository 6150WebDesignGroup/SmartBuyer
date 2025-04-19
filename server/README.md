# SmartBuyer – Final Project for Web Development

## Overview

SmartBuyer is a responsive full-stack e-commerce web application built with React, Node.js, Express, and MongoDB. The system supports multiple user roles, complete transactional flows, and full CRUD functionality. It includes user login, product browsing, cart management, order creation, and refund workflows, along with an admin dashboard for refund review.

---

## User Roles

### Admin
- Reviews and processes refund requests
- Manages product listings

### User
- Registers and logs in
- Browses products by category
- Adds items to cart
- Creates and pays for orders
- Requests refunds

---

## End-to-End Transaction Flows

### Product Purchase Flow
1. Login
2. Browse products
3. Add to cart
4. Place order
5. Simulate payment

### Refund Flow
1. View orders
2. Request refund
3. Admin reviews and processes decision

---

## Tech Stack

### Frontend
- React
- HTML, CSS, Bootstrap
- Axios for API integration

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- bcrypt for password hashing

---

## Key Features

### User Side
- Secure registration and login
- Product listing by category and search
- Shopping cart with quantity control
- Order placement with mock payment
- Refund request system
- Responsive UI

### Admin Side
- View and process refund requests
- Product management dashboard
- Role-based access control

---

## MongoDB Schema Models

- `User.js`: Stores user info and hashed passwords
- `Product.js`: Includes name, price, stock, description, and category reference
- `ProductCategory.js`: Used for organizing and filtering products
- `Cart.js`: Stores product IDs and quantities for each user
- `Order.js`: Includes status, payment and refund fields, and order details
- `Delivery.js`: (Optional) used for tracking deliveries

---

## Local Setup Instructions

### Backend
cd server
npm install
npm start

### Requirements Checklist
 Mobile responsive UI

 6+ pages implemented

 Role-based session control

 Full transaction flows

 RESTful API design

 Password encryption

 GitHub commit history