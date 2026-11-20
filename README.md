# MAVI — Modern Premium Fashion E-Commerce Platform

A production-ready, full-stack luxury fashion e-commerce application inspired by **Zara, Massimo Dutti, COS, and H&M Premium**. Designed with an architectural aesthetic, refined typography, responsive layouts, a comprehensive admin console, multilingual localization (Uzbek default, English, Russian), and automated **Telegram Bot API order dispatch**.

---

## 💎 Brand Identity & Visual System

- **Brand Name**: MAVI (MAVI Atelier)
- **Concept**: Modern premium fashion clothing store
- **Aesthetic**: Minimalist, architectural, elegant, professional
- **Color Palette**:
  - Primary: `#111111` (Deep Obsidian)
  - Background: `#FFFFFF` (Pure White)
  - Secondary Background: `#F5F4F1` (Warm Ivory)
  - Accent: `#B8A58A` (Champagne Sand)
  - Text: `#222222` (Charcoal)
  - Muted: `#777777` (Neutral Gray)
- **Typography**: `Playfair Display` (Serif headlines) & `Plus Jakarta Sans` (Body)

---

## 🚀 Tech Stack

### Frontend (`client/`)
- **React.js** (JavaScript ES6+, Vite)
- **Tailwind CSS & DaisyUI** (Custom luxury color tokens and typography)
- **React Router v6** (Client-side routing)
- **i18next & react-i18next** (Full multilingual localization with zero page reload)
- **Lucide React** (Minimalist icon system)
- **React Hot Toast** (Toast notifications)
- **Axios** (API client with JWT auto-injection)
- **Context API** (`AuthContext`, `CartContext`, `WishlistContext`)

### Backend (`server/`)
- **Node.js & Express.js**
- **MongoDB & Mongoose** (With automatic in-memory MongoDB fallback for instant zero-config local development)
- **Telegram Bot API** (Automated HTML-formatted order alerts with retry logic and error logging)
- **bcryptjs & jsonwebtoken** (Password hashing & role-based authentication)
- **Helmet, CORS, Express-Rate-Limit** (Web application security)

---

## 🌐 Multilingual System (Uzbek, English, Russian)

- **Default Language**: **Uzbek (`uz`)**
- **Instant Switching**: Smooth in-place language switching without reloading the page.
- **Persistence**: Language selection automatically saved to `localStorage` (`mavi_language`).
- **Translation Coverage**: Complete translation files in `client/src/locales/`:
  - `uz.json`: O‘zbekcha (Default)
  - `en.json`: English
  - `ru.json`: Русский

---

## 🛍 Key Features

### 1. Customer Storefront
- **Dynamic Homepage**:
  - Full-width hero banner with campaign headlines
  - "New Arrivals" and "Best Sellers" curated product grids
  - Men's and Women's collection showcase capsules
  - Interactive debounced live search modal with instant product preview
  - Client testimonials, newsletter subscription, and Instagram fashion gallery (`#MAVISTYLE`)
- **Catalog & Advanced Filtering (`/shop`)**:
  - 13 Categories: Men, Women, T-Shirts, Shirts, Hoodies, Sweatshirts, Jackets, Coats, Jeans, Trousers, Dresses, Shoes, Accessories
  - Multi-attribute filters: Categories, price range, size pills, color swatches, stock availability
  - Sorting: Newest first, Price: low to high, Price: high to low, Most popular
- **Product Details (`/product/:id`)**:
  - Multi-image zoom gallery with responsive thumbnail selector
  - Real-time stock verification by size and color
  - Size Guide modal with European (EU) measurements
  - Customer review submission with 5-star ratings
  - Related and Recently Viewed product carousels
- **Cart & Checkout (`/cart`, `/checkout`)**:
  - Guest and authenticated user cart persistence (`localStorage`)
  - Subtotal, delivery fee calculation (Complimentary above 500,000 UZS), and promo code engine
  - Payment methods: Cash on Delivery (COD), Click, Payme
  - Server-side stock and price validation

### 2. Telegram Bot Integration (Critical Feature)
Whenever a customer successfully places an order, the dedicated Telegram service formats an HTML order summary and dispatches it directly to the configured Telegram channel (`1004335804992`).

**Notification Format:**
```
🛍 NEW ORDER — MAVI
━━━━━━━━━━━━━━━━
🆔 ORDER ID: #MAVI-20261117-XXXX

👤 CUSTOMER INFORMATION
Name: Aziz Rakhimov
Phone: +998 90 123 45 67
Region: Toshkent shahri
District: Mirobod tumani
Address: Nukus ko‘chasi, 24-uy, 15-xonadon

━━━━━━━━━━━━━━━━
🛒 PRODUCTS
Product: Kashmir Aralashmali Minimalist Palto
Size: L | Color: Camel
Quantity: 1 | Price: 1 590 000 UZS

━━━━━━━━━━━━━━━━
💰 PAYMENT INFORMATION
Subtotal: 1 590 000 UZS
Delivery: FREE
Discount: -150 000 UZS
TOTAL: 1 440 000 UZS

Payment method: Cash on Delivery
📝 Customer notes: Iltimos, soat 14:00 dan keyin yetkazing

━━━━━━━━━━━━━━━━
MAVI ONLINE STORE
```

**Resilience & Security:**
- Secrets are stored solely in backend `.env` (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).
- Never exposed to React client or client API responses.
- If Telegram API is temporarily down, the order is safely saved in MongoDB, and the admin console provides a **"Retry Telegram Dispatch"** action.

### 3. Administrator Dashboard (`/admin`)
- **Protected Access**: Role-based authentication requiring admin credentials.
- **Overview & Analytics**:
  - Live revenue tally, total orders, customers, and product counts
  - Order status breakdown (Pending, Processing, Shipped, Delivered, Cancelled)
  - Recent orders feed
- **Product Management**: Full CRUD, image URLs, sizes, colors, prices, discounts, and multilingual content in UZ, EN, RU.
- **Order Management**: Search by customer or Order ID, update order statuses, and trigger manual Telegram dispatch retries.
- **Customer Management**: Registered customer history and total spending metrics.
- **Coupons Management**: Percentage or fixed discount coupons with minimum order limits and expiration dates.
- **Store & Telegram Settings**: Adjust delivery fees, free delivery threshold, and run live Telegram Bot connection diagnostics.

---

## 🔑 Default Accounts & Credentials

### Administrator Portal
- **URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@mavi.uz`
- **Password**: `AdminPassword2026!`

### Sample Customer Account
- **URL**: `http://localhost:5173/login`
- **Email**: `customer@mavi.uz`
- **Password**: `CustomerPassword2026!`

### Sample Promo Coupons
- `MAVI10`: 10% privilege discount on orders above 300,000 UZS
- `WELCOME`: 50,000 UZS flat discount on orders above 250,000 UZS
- `VIPPREMIUM`: 15% privilege discount on orders above 1,000,000 UZS

---

## 🛠 Installation & Running Guide

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### 1. Clone & Setup Backend
```bash
cd server
npm install
```
Configure `server/.env` (a template is provided in `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/mavi_boutique
JWT_SECRET=mavi_secret_key_super_secure_2026
JWT_EXPIRES_IN=7d

# Telegram Bot Integration
TELEGRAM_BOT_TOKEN=YOUR_NEW_BOT_TOKEN
TELEGRAM_CHAT_ID=1004335804992
TELEGRAM_ENABLED=true

CLIENT_URL=http://localhost:5173
```
*Note: If local MongoDB is not running on port 27017, the server automatically starts a zero-config in-memory MongoDB instance and auto-seeds the catalog.*

Start the backend:
```bash
npm start
# or development with auto-watch:
npm run dev
```

### 2. Setup & Run Frontend
```bash
cd client
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🛡 Security Highlights
- **Server-Side Price Validation**: Never trusts totals computed on the client. All prices and discounts are re-calculated against database records on checkout.
- **Stock Guard**: Concurrent order placements decrement stock atomically and reject out-of-stock items.
- **Rate Limiting**: Protects `/api` routes against brute force and DDoS attacks.
- **Helmet Headers**: Injects secure HTTP headers and content security policies.
- **Sanitized Telegram Messages**: All customer-supplied inputs are HTML-escaped before dispatch to Telegram channels.

---

## ☁️ Vercel Deployment Guide
For complete step-by-step instructions on deploying the fullstack platform to Vercel with MongoDB Atlas and Telegram notifications, see [VERCEL_DEPLOY_GUIDE.md](file:///c:/mavi%20butique/VERCEL_DEPLOY_GUIDE.md).

