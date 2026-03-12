# 🛵 SaigonRide – Tài Xỉu (Fake Gambling Demo)

> **Final Project – Node.js + Express · MVC Architecture · Bootstrap 5**
> Tier 3 (9.5) + Tier 4 Bonus (VNPay Sandbox + Admin Dashboard + Jest Tests)

---

## 📁 Project Structure (MVC)

```
saigonride-taixiu/
├── app.js                      ← Express entry point
├── models/
│   ├── User.js                 ← User state & stats
│   ├── Game.js                 ← Dice logic & round history
│   └── Transaction.js          ← VNPay payment records
├── controllers/
│   ├── gameController.js       ← Roll logic, history
│   ├── paymentController.js    ← VNPay create/return/IPN
│   └── adminController.js      ← Dashboard data + live API
├── routes/
│   ├── index.js
│   ├── game.js
│   ├── admin.js
│   └── payment.js
├── views/
│   ├── partials/
│   │   ├── head.ejs            ← Shared HTML head + navbar
│   │   └── foot.ejs            ← Shared footer + BS5 scripts
│   ├── game.ejs                ← Main game page
│   ├── admin/dashboard.ejs     ← Admin dashboard w/ Chart.js
│   ├── payment/deposit.ejs     ← Nạp xu page
│   ├── payment/return.ejs      ← VNPay return page
│   ├── 404.ejs
│   └── error.ejs
├── public/
│   ├── css/custom.css          ← Full theme (Bootstrap overrides)
│   └── js/game.js              ← Client-side game controller
├── utils/
│   └── vnpay.js                ← VNPay URL builder + checksum verifier
├── tests/
│   ├── models.test.js          ← Unit: User, Game, Transaction models
│   ├── vnpay.test.js           ← Unit: VNPay helper utility
│   ├── controllers.test.js     ← Unit: Controllers with mocked deps
│   └── api.test.js             ← Integration: Supertest full routes
└── .env.example
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill .env
cp .env.example .env
# Edit .env with your VNPay Sandbox credentials

# 3. Run development server
npm run dev

# 4. Open browser
open http://localhost:3000
```

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

### Test Coverage
| Suite | Tests | What it covers |
|---|---|---|
| `models.test.js` | 18 | User CRUD, Game dice logic, Transaction state machine |
| `vnpay.test.js` | 7 | URL builder, HMAC-SHA512 checksum, signature verification |
| `controllers.test.js` | 7 | Controller logic with mocked models |
| `api.test.js` | 20 | Full HTTP integration: game, admin, payment routes |
| **Total** | **52** | |

---

## 💳 VNPay Sandbox Setup

1. Register at https://sandbox.vnpayment.vn/devreg/
2. Get `TMN_CODE` and `HASH_SECRET` from the merchant portal
3. Fill in `.env`:
   ```
   VNPAY_TMN_CODE=YOUR_CODE
   VNPAY_HASH_SECRET=YOUR_SECRET
   VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay-return
   ```

### Test Card (Sandbox)
| Field | Value |
|---|---|
| Card Number | `9704198526191432198` |
| Expiry | `07/15` |
| Name | `NGUYEN VAN A` |
| OTP | `123456` |

---

## 📊 Pages

| URL | Description |
|---|---|
| `/game` | Main Tài Xỉu game |
| `/payment/deposit` | Nạp xu via VNPay Sandbox |
| `/payment/vnpay-return` | VNPay redirect return |
| `/admin` | Admin Dashboard (live Chart.js, auto-refresh 5s) |
| `/admin/api/stats` | Live JSON stats endpoint |

---

## 🏗️ MVC Architecture

```
Browser
   │
   ▼
Route  (/game, /admin, /payment)
   │
   ▼
Controller  (validates input, orchestrates)
   │         ├── reads/writes Model
   │         └── passes data to View
   ▼
Model  (User / Game / Transaction)
   │
   ▼
View  (EJS templates + Bootstrap 5)
```

---

## ⚠️ Disclaimer
This is a **fake gambling simulation** for educational/academic purposes only.
No real money is involved. Built for SaigonRide Final Project.
