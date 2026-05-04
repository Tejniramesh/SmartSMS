# 🚀 SmartSMS — Intelligent Messaging Platform

A full-stack SMS management SaaS application with a premium, modern UI.

## ✨ Features

- 🔐 JWT Authentication (Login / Register)
- 📤 Send Single or Bulk SMS (fake — always delivers)
- 📊 Analytics Dashboard with stats
- 📋 Message History with search & filter
- 👥 Contact Management (CRUD)
- 💳 Credit system
- 🎨 Premium SaaS UI (Stripe/Notion-level design)

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose (with in-memory fallback) |
| Auth | JWT |

---

## ⚡ Quick Start (3 steps)

### Step 1 — Backend

```bash
cd backend
npm install
npm run dev
```
> Backend runs at: http://localhost:5000

### Step 2 — Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at: http://localhost:3000

### Step 3 — Open browser

```
http://localhost:3000
```

---

## 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| Email | demo@smartsms.io |
| Password | password |

> Or register a new account — you'll get 500 free credits!

---

## 📁 Project Structure

```
smartsms/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── sms.js
│   │   ├── contacts.js
│   │   └── dashboard.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── SendSMS.jsx
    │   │   ├── Messages.jsx
    │   │   └── Contacts.jsx
    │   ├── components/
    │   │   └── Layout.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── lib/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🗄 MongoDB Setup (Optional)

The app works **without MongoDB** (in-memory fallback mode).

To use MongoDB:
1. Install [MongoDB Community](https://www.mongodb.com/try/download/community)
2. Start MongoDB: `mongod`
3. The `.env` already points to `mongodb://localhost:27017/smartsms`

---

## 🎨 UI Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Split-screen auth page |
| Dashboard | `/dashboard` | Stats overview |
| Send SMS | `/send` | Compose & send |
| Messages | `/messages` | History + search |
| Contacts | `/contacts` | CRUD contacts |

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | No | Login |
| POST | /api/auth/register | No | Register |
| POST | /api/sms/send | Yes | Send SMS |
| GET | /api/sms | Yes | Get messages |
| GET | /api/contacts | Yes | List contacts |
| POST | /api/contacts | Yes | Add contact |
| DELETE | /api/contacts/:id | Yes | Delete contact |
| GET | /api/dashboard/stats | Yes | Dashboard stats |

---

Built with ❤️ — SmartSMS Pro
