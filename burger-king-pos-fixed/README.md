# 🍔 BK Crown - Full Stack POS & Restaurant Website

A complete Burger King-style restaurant website + POS system built for the **Odoo POS Hackathon**.

## 🚀 Tech Stack
- **Frontend**: React 18, Tailwind CSS, GSAP animations
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.IO (Kitchen Display)
- **Auth**: JWT
- **Payments**: UPI QR Code, Razorpay integration

---

## ⚡ Quick Start

### Prerequisites
- Node.js v16+
- MongoDB running locally OR MongoDB Atlas URI
- npm or yarn

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Copy .env example
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and other secrets
```

### 3. Seed Database

```bash
cd backend
node seed.js
```

This creates:
- 24 menu items across 6 categories
- 10 tables (Ground + First floor)
- 3 offers/coupon codes
- Admin: `admin@bkcrown.com` / `admin123`
- Staff: `staff@bkcrown.com` / `staff123`

### 4. Start Backend

```bash
cd backend
npm run dev    # development with nodemon
# OR
npm start      # production
```

Backend runs on: `http://localhost:5000`

### 5. Start Frontend

```bash
cd frontend
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🌐 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, menu highlights, offers |
| `/menu` | Full menu with filters (veg, bestseller, search, categories) |
| `/cart` | Cart with coupon codes and order type |
| `/checkout` | Payment flow (Cash, Card, UPI QR) |
| `/order-confirm/:id` | Order confirmation with crown points |
| `/offers` | All offers and promo codes |
| `/dine-in` | Table selection floor plan |
| `/table/:token` | QR scan → direct table order |
| `/login` | Customer/Staff login |
| `/signup` | New account + crown rewards |
| `/profile` | User profile + order history |
| `/pos` | **Staff POS Terminal** |
| `/kitchen` | **Kitchen Display (real-time)** |
| `/admin` | **Admin Dashboard** |

---

## 💳 Payment Methods

1. **Cash** — Pay at counter
2. **UPI QR** — Dynamic QR generated per order (real UPI string)
3. **Card/Digital** — Mock integration (wire up Razorpay with your keys)

To enable **Razorpay**:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
```

---

## 🏆 Features

### Customer Side
- ✅ Homepage with GSAP animations and hero carousel
- ✅ Menu with category filters, veg filter, search, bestseller filter
- ✅ Product detail modal with variants
- ✅ Cart with coupon validation
- ✅ 3 order types: Dine In, Takeaway, Delivery
- ✅ UPI QR payment flow
- ✅ Crown Loyalty Points earned per order
- ✅ Order confirmation page
- ✅ Table selection with floor plan
- ✅ QR code table scanning

### Staff / POS
- ✅ Full POS terminal (touch-optimized)
- ✅ Category + product grid with search
- ✅ Cart management with quantities
- ✅ Table picker for dine-in
- ✅ Cash / Card / UPI payment
- ✅ Send order to kitchen (Socket.IO)
- ✅ Kitchen Display with Kanban (To Cook → Preparing → Completed)
- ✅ Real-time order updates

### Admin
- ✅ Dashboard with revenue stats (today, week, total)
- ✅ Recent orders table
- ✅ Quick navigation to POS/Kitchen

---

## 🚀 Deploy on Vercel/Netlify

### Frontend (Netlify)
```bash
cd frontend
npm run build
# Deploy the build/ folder to Netlify
```

Set environment variable:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend (Railway/Render)
1. Push backend folder to GitHub
2. Deploy on Railway or Render
3. Set environment variables from `.env.example`
4. Use MongoDB Atlas for database

---

## 📁 Project Structure

```
burger-king-pos/
├── backend/
│   ├── server.js          # Express + Socket.IO server
│   ├── seed.js            # Database seeder
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── index.js       # Category, Order, Table, Offer
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── orders.js
│   │   ├── tables.js
│   │   ├── offers.js
│   │   ├── payments.js
│   │   ├── dashboard.js
│   │   └── kitchen.js
│   └── middleware/
│       └── auth.js
└── frontend/
    └── src/
        ├── App.js
        ├── context/
        │   ├── AuthContext.js
        │   └── CartContext.js
        ├── utils/
        │   └── api.js
        ├── components/
        │   ├── Navbar.js
        │   └── Footer.js
        └── pages/
            ├── HomePage.js
            ├── MenuPage.js
            ├── CartPage.js
            ├── CheckoutPage.js
            ├── OrderConfirmPage.js
            ├── LoginPage.js       (exports LoginPage + SignupPage)
            ├── ProfilePage.js
            ├── OffersPage.js
            ├── DineInPage.js
            ├── POSPage.js
            ├── KitchenDisplayPage.js
            └── AdminDashboard.js
```

---

## 👑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bkcrown.com | admin123 |
| Staff | staff@bkcrown.com | staff123 |

---

Built with 🔥 for the **Odoo POS Hackathon**
