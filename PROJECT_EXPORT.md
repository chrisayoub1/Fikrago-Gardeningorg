# Fikrago Gardening Marketplace - Project Export

## 🌐 Live Site
- **URL:** https://t1xd62bua560-d.space.z.ai

## 🔐 Login Credentials
- **Admin:** admin@fikrago.com / cnss2031
- **Vendor:** vendor@fikrago.com / vendor123

## 💳 PayPal Configuration (LIVE MODE)
- **Client ID:** AZhZpOus2lbZl-4nT-1QJTKsMOPTCZVA1bWPAcupTfOsR5TquLcVf7UK3UXQoKZjQwwHVESPCiEbb9Q4
- **Client Secret:** EL4saVF8pSnCcILR1L9TH80ZTYYHN0VKOJFtOm2wxLQ9eoYj0iAs1VpjI61xsqqo_L9fT6d_f7YCY6Gh

## 🔗 PayPal Webhooks (Configure in PayPal Dashboard)
- **Orders Webhook:** https://t1xd62bua560-d.space.z.ai/api/webhooks/paypal-orders
- **Subscriptions Webhook:** https://t1xd62bua560-d.space.z.ai/api/webhooks/paypal

---

## 📋 What You Need for New Editor/Cursor

### 1. Environment Variables (.env)
Create a `.env` file with:
```
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="fikrago-gardening-secret-key-2024-secure"

# PayPal LIVE Credentials
PAYPAL_CLIENT_ID="AZhZpOus2lbZl-4nT-1QJTKsMOPTCZVA1bWPAcupTfOsR5TquLcVf7UK3UXQoKZjQwwHVESPCiEbb9Q4"
PAYPAL_CLIENT_SECRET="EL4saVF8pSnCcILR1L9TH80ZTYYHN0VKOJFtOm2wxLQ9eoYj0iAs1VpjI61xsqqo_L9fT6d_f7YCY6Gh"
PAYPAL_MODE="live"

# Google OAuth (if using)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Database Setup
- **Database Type:** SQLite (file: `db/custom.db`)
- **ORM:** Prisma
- **To Set Up:** Run `bun run db:push` after installing dependencies

### 3. Install & Run Commands
```bash
bun install
bun run db:push
bun run dev
```

---

## 📁 Key Files Structure

### Backend (API Routes)
- `src/app/api/auth/[...nextauth]/route.ts` - Authentication (NextAuth.js)
- `src/app/api/webhooks/paypal/route.ts` - Subscription webhooks
- `src/app/api/webhooks/paypal-orders/route.ts` - Order webhooks
- `src/app/api/paypal/create-order/route.ts` - Create PayPal order
- `src/app/api/paypal/capture-order/route.ts` - Capture payment
- `src/app/api/paypal/create-subscription/route.ts` - Create subscription
- `src/app/api/admin/*` - Admin API endpoints

### Database Schema
- `prisma/schema.prisma` - All database models

### Frontend Pages
- `src/app/page.tsx` - Homepage
- `src/app/shop/page.tsx` - Shop page
- `src/app/vendors/page.tsx` - Vendors listing
- `src/app/blog/page.tsx` - Blog page
- `src/app/admin/*` - Admin dashboard

---

## ⚠️ YES, You Need Backend & Database!

### Backend Required For:
1. **Authentication** (NextAuth.js)
   - Login/Register
   - Google OAuth
   - Session management

2. **PayPal Integration**
   - Create orders
   - Capture payments
   - Handle webhooks
   - Split payments (15% platform / 85% vendor)

3. **Database Operations**
   - Products, Orders, Users
   - Vendor profiles
   - Subscriptions

### Database Tables:
- User, VendorProfile, Category, Product
- Order, OrderItem, Address
- Subscription, SubscriptionPayment
- Settings

---

## 🚀 For Cursor/New Editor

Tell them:
1. "This is a Next.js 16 marketplace with PayPal payments"
2. "Need Prisma with SQLite database"
3. "NextAuth.js for authentication"
4. "PayPal SDK for payments (already integrated)"
5. "Copy all files from this project"

---

## 📦 Sample Data Already Created
- 4 Categories
- 8 Products
- 1 Vendor (Green Thumb Gardens)
- Admin user configured
