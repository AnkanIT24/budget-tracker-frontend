# 💰 Budget Tracker — Full Stack Web App

A personal finance management app built with **Spring Boot + React**. Track your income, expenses, and budgets with a clean dark UI and smooth animations.

![Budget Tracker](https://img.shields.io/badge/Spring%20Boot-3.1-brightgreen) ![React](https://img.shields.io/badge/React-19-blue) ![MySQL](https://img.shields.io/badge/MySQL-8-orange) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with token-based auth
- 📊 **Dashboard** — Monthly income, expenses, balance snapshot
- 💸 **Transactions** — Add, edit, delete with category & date filtering
- 🎯 **Budgets** — Set monthly spending limits per category with progress bars
- 🏷️ **Categories** — Manage income & expense categories with inline rename
- 📱 **Mobile Ready** — Fully responsive PWA, installable on Android & iOS
- ✨ **Smooth Animations** — Framer Motion page transitions & breathing hover effects
- 💀 **Skeleton Loaders** — Shimmer placeholders on every page during data fetch

---

## 🛠️ Tech Stack

### Backend
| Tech | Purpose |
|------|---------|
| Java 17 | Language |
| Spring Boot 3.1 | Framework |
| Spring Security + JWT | Authentication |
| Spring Data JPA | ORM |
| MySQL 8 | Database |
| Docker | Containerization |

### Frontend
| Tech | Purpose |
|------|---------|
| React 19 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Hook Form + Zod | Forms & Validation |
| Axios | HTTP Client |
| Sonner | Toast Notifications |
| Lucide React | Icons |

---

## 🚀 Local Setup

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8

### 1. Clone the repo
```bash
git clone https://github.com/AnkanIT24/budget-tracker-frontend.git
cd budget-tracker-frontend
```

### 2. MySQL Setup
```sql
CREATE DATABASE budget_db;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
```

### 3. Backend
Open `backend/` in IntelliJ IDEA as a Maven project and run `BudgetApplication.java`.

Or with Maven:
```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🌍 Deployment

| Service | Platform |
|---------|----------|
| Backend | Render (Docker) |
| Frontend | Vercel |
| Database | Railway MySQL |

### Environment Variables

**Backend (Render):**
```
DATASOURCE_URL=jdbc:mysql://host:port/db?useSSL=true&serverTimezone=UTC
DATASOURCE_USERNAME=your_db_user
DATASOURCE_PASSWORD=your_db_password
JWT_SECRET=your_secret_key_min_32_chars
PORT=10000
```

**Frontend (Vercel):**
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 📱 Install as Mobile App (PWA)

**Android:** Open in Chrome → tap ⋮ menu → **Add to Home screen**

**iPhone:** Open in Safari → tap Share → **Add to Home Screen**

---

## 📁 Project Structure

```
budget-tracker/
├── backend/                  # Spring Boot API
│   ├── src/main/java/net/ankan/budget/
│   │   ├── controller/       # REST endpoints
│   │   ├── service/          # Business logic
│   │   ├── repository/       # JPA repositories
│   │   ├── entity/           # JPA entities
│   │   ├── security/         # JWT + Spring Security
│   │   └── exception/        # Global error handling
│   ├── Dockerfile
│   └── pom.xml
│
└── frontend/                 # React SPA
    ├── src/
    │   ├── pages/            # Dashboard, Transactions, Budgets, Categories, Settings
    │   ├── components/       # Layout, UI components
    │   ├── hooks/            # AuthContext
    │   └── services/         # Axios API calls
    ├── vercel.json
    └── vite.config.js
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login & get JWT | ❌ |
| POST | `/api/auth/change-password` | Change password | ✅ |
| GET | `/api/categories` | Get all categories | ✅ |
| POST | `/api/categories` | Create category | ✅ |
| PUT | `/api/categories/{id}` | Rename category | ✅ |
| DELETE | `/api/categories/{id}` | Delete category | ✅ |
| GET | `/api/transactions` | Get transactions (with filters) | ✅ |
| POST | `/api/transactions` | Add transaction | ✅ |
| PUT | `/api/transactions/{id}` | Update transaction | ✅ |
| DELETE | `/api/transactions/{id}` | Delete transaction | ✅ |
| GET | `/api/transactions/summary` | Monthly summary | ✅ |
| GET | `/api/budgets/status` | Budget status with % used | ✅ |
| POST | `/api/budgets` | Set budget | ✅ |
| PUT | `/api/budgets/{id}` | Update budget limit | ✅ |
| DELETE | `/api/budgets/{id}` | Remove budget | ✅ |

---

## 👤 Author

**Ankan Chakraborty**
- GitHub: [@AnkanIT24](https://github.com/AnkanIT24)
- Email: dasonu24@gmail.com

---

## 📄 License

MIT License — free to use and modify.
