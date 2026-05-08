# Ecomart Web Client 🛒

A modern, responsive e-commerce frontend built with React and TypeScript. Designed for high performance and an excellent user experience, featuring robust state management, client-side routing, and beautifully crafted UI components.

## 🛠 Tech Stack

- **Framework:** React 19 + Vite 8
- **Language:** TypeScript 6
- **Styling:** Tailwind CSS + shadcn
- **Routing:** React Router DOM (~> 7.14)
- **Icons:** Lucide React
- **Data Visualization:** Chart.js

## 📦 Setting Up the Application

### 1. Installation

Ensure you have Node.js (v20+) and `npm` installed. Then, install your dependencies:

```bash
# Install the necessary packages
npm install
```

### 2. Configuration

Set up your environment variables to connect to the Ecomart API backend. Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Running the Development Server

Start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### 4. Building for Production

To create a production-ready build, run:

```bash
npm run build
```

The compiled assets will be generated in the `dist/` directory.

To check the production build preview, run:

```bash
npm run preview
```

The application will be available at `http://localhost:4173`.

## 🏗 Application Structure

- `src/components/` - Reusable UI components (including shadcn UI elements).
- `src/pages/` - Main view components representing application routes (e.g., Home, Products, Cart, Checkout).
- `src/context/` - React Context providers for global state management (e.g., Authentication, Cart State).
- `src/services/` - API interaction layer for communicating with the Ecomart Rails backend.
- `src/lib/` - Utility functions, type definitions, and helpers.

## 🛣 Key Features

- **Authentication:** JWT-based user login, registration, and session management.
- **Product Catalog:** Browse products, view detailed listings, and search functionality.
- **Shopping Cart:** Add, remove, update quantities, and persist cart items.
- **Checkout Flow:** Secure payment processing and order finalization.
- **Order Management:** View order history and manage placed orders.
- **Responsive Design:** Mobile-first approach ensuring a seamless experience across all devices.
