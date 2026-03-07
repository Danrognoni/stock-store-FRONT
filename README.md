# 🛒 Stock-Store Frontend (Angular Client)

The official web application client for the **Stock-Store** ecosystem. Built as a dynamic and responsive Single Page Application (SPA) using Angular, this frontend serves a dual purpose: it provides a complete **E-commerce storefront** for end-users, and a robust **Backoffice Management System** for employees and administrators to handle physical inventory, suppliers, and user roles.

This application is specifically designed to consume the Stock-Store Spring Boot REST API.

## 🚀 Technologies & Tools

* **Framework:** Angular
* **Language:** TypeScript
* **UI Components & Styling:** Angular Material, custom SCSS (`material-theme.scss`), CSS
* **State Management & Asynchrony:** RxJS (Observables, Subjects)
* **Security:** JWT via HttpOnly Cookies handling, custom HttpInterceptors
* **Routing:** Advanced Angular Router with specialized Guards

## 🏗️ Architecture & Security

The project relies heavily on a secure, Role-Based Access Control (RBAC) architecture, segregating the platform into different domains protected by Angular Route Guards:

* **Authentication Interceptor (`authentication-interceptor.ts`):** Automatically intercepts outgoing HTTP requests to attach necessary credentials and handle global unauthorized (401/403) responses.
* **AuthGuard (`auth-guard.ts`):** Prevents unauthenticated access to private routes.
* **RoleGuard (`role-guard.ts`):** Validates the user's role (`USER`, `EMPLOYEE`, `ADMIN`) before activating specific modules, preventing a standard user from accessing the backoffice.
* **LoginRedirectGuard:** Prevents users who are already logged in from navigating back to the login or registration screens.

---

## 🧩 Key Features & Modules

### 🛍️ Online Store (E-Commerce Client) - *Role: USER*
The storefront dedicated to end customers for standard e-commerce operations.
* **Product Catalog (`/online-store/catalog`):** Browse the active product list and filter by categories.
* **Shopping Cart (`/cart`):** Manage items selected for purchase, updating amounts in real-time. Includes integration preparation for Mercado Pago checkout.
* **Wishlist (`/online-store/wishlist`):** A dedicated space for users to save products they are interested in buying later.
* **Order History (`/online-store/order-list`):** Customers can review their past purchases and order details.

### 📦 Stock Manager (Backoffice) - *Role: EMPLOYEE & ADMIN*
The internal management system used to maintain the business.
* **Dashboard (`/dashboard`):** The main hub providing quick overviews of stock levels and business metrics.
* **Inventory Control (`/inventory-items`):** The core module to manage physical stock on hand.
* **Catalog Management (`/products` & `/categories`):** Create, update, or apply logical deletion to products and categories, reflecting instantly on the storefront.
* **Supplier Management (`/suppliers` & `/supplier-orders`):** Maintain a database of providers and generate purchase orders to restock internal inventory.

### 🔐 Admin Panel - *Role: ADMIN*
Exclusive area for system administrators.
* **User Management (`/admin/user-list`):** View all registered accounts, promote users to `EMPLOYEE` or `ADMIN`, and manage account bans/suspensions.

---

## 📁 Project Structure

The codebase is organized by feature and domain to ensure scalability:

* `src/app/models/`: TypeScript interfaces and classes representing data transfer objects (DTOs) like `ProductDet`, `CartItemRequest`, and `UserUpdate`.
* `src/app/services/`: Injectable services handling HTTP communication with the backend (e.g., `inventory-item.ts`, `cart-service.ts`, `mercado-pago-service.ts`).
* `src/app/pages/`: Smart components representing individual routes, split into sub-domains (`/admin`, `/cart`, `/online-store`, `/inventory-item`, etc.). Contains Lists, Forms, and Detail views.
* `src/app/components/`: Reusable presentation components. Notably, it contains role-specific layout wrappers (`home-layout`, `online-store-layout`, `stock-manager-layout`) to display context-aware navigation bars.
* `src/app/guard/`: Contains all routing security logic.

## 🛠️ Local Development Setup

To run this project on your local machine, ensure you have **Node.js** and the **Angular CLI** installed.

1. **Clone the repository.**
2. **Navigate into the frontend directory.**
3. **Install the required dependencies:**
   ```bash
   npm install
   ng serve -o
