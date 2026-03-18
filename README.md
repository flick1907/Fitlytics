# ⚡ Fitlytics — Fitness Tracking & Analytics Platform

A modern, production-grade full-stack fitness tracking and analytics SaaS application built with React, Express, TypeScript, and PostgreSQL.

![Tech Stack](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![Express](https://img.shields.io/badge/Express-4.21-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue) ![Prisma](https://img.shields.io/badge/Prisma-6.4-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

---

## ✨ Features

### Core
- **JWT Authentication** — Secure register/login with bcrypt password hashing
- **Workout Tracker** — Full CRUD with type, sets, reps, weight, duration, calories
- **Progress Tracking** — Body weight, body fat %, measurements over time
- **Goal System** — Weekly workout and calorie goals with progress bars
- **Calorie Analytics** — Bar, line, and pie charts with Recharts

### Advanced
- **🤖 AI Workout Insights** — Pattern analysis, muscle group gaps, strength trends
- **🗓️ Workout Heatmap** — GitHub-style contribution graph for consistency
- **🏅 Personal Records** — Automatic PR tracking (max weight, calories, streak)
- **📋 Activity Timeline** — Chronological feed of workouts and achievements
- **📦 Data Export** — Download workout history as CSV or JSON

### UI/UX
- **Dark Theme** with glassmorphism cards
- **Animated Counters** on dashboard stats
- **Framer Motion** animations throughout
- **Loading Skeletons** for all data states
- **Toast Notifications** for user feedback
- **Responsive** sidebar + navbar layout

---

## 🛠️ Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Frontend    | React 19, TypeScript, Vite             |
| Styling     | TailwindCSS 3, Framer Motion          |
| Charts      | Recharts, react-calendar-heatmap      |
| Backend     | Node.js, Express.js, TypeScript       |
| Database    | PostgreSQL, Prisma ORM                |
| Auth        | JWT, bcrypt                           |

---

## 📂 Project Structure

```
fitlytics/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Charts/         # Recharts chart components
│       │   ├── Dashboard/      # Dashboard widgets
│       │   ├── Layout/         # Sidebar, Navbar, DashboardLayout
│       │   └── UI/             # Skeleton, Modal
│       ├── hooks/              # useAuth context
│       ├── pages/              # All route pages
│       └── services/           # Axios API layer
├── backend/
│   ├── prisma/                 # Database schema
│   └── src/
│       ├── config/             # Environment, database
│       ├── controllers/        # Route handlers
│       ├── middleware/         # Auth, error handling
│       ├── routes/             # Express routes
│       └── utils/              # Helper functions
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/fitlytics.git
cd fitlytics
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL connection string and JWT secret

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init

# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/fitlytics"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 📡 API Documentation

### Authentication
| Method | Endpoint              | Description      |
|--------|-----------------------|------------------|
| POST   | `/api/auth/register`  | Register user    |
| POST   | `/api/auth/login`     | Login user       |

### User
| Method | Endpoint            | Description       |
|--------|---------------------|-------------------|
| GET    | `/api/user/profile` | Get user profile  |
| PUT    | `/api/user/profile` | Update profile    |

### Workouts
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | `/api/workouts`       | Create workout       |
| GET    | `/api/workouts`       | List workouts        |
| PUT    | `/api/workouts/:id`   | Update workout       |
| DELETE | `/api/workouts/:id`   | Delete workout       |

### Progress & Goals
| Method | Endpoint          | Description         |
|--------|-------------------|---------------------|
| POST   | `/api/progress`   | Add progress entry  |
| GET    | `/api/progress`   | List progress       |
| POST   | `/api/goals`      | Create goal         |
| GET    | `/api/goals`      | List goals          |
| PUT    | `/api/goals/:id`  | Update goal         |

### Analytics
| Method | Endpoint                            | Description           |
|--------|-------------------------------------|-----------------------|
| GET    | `/api/stats/dashboard`              | Dashboard stats       |
| GET    | `/api/analytics/insights`           | AI workout insights   |
| GET    | `/api/analytics/workout-heatmap`    | Heatmap data          |
| GET    | `/api/analytics/personal-records`   | Personal records      |
| GET    | `/api/analytics/timeline`           | Activity timeline     |

### Export
| Method | Endpoint                            | Description           |
|--------|-------------------------------------|-----------------------|
| GET    | `/api/export/workouts?format=csv`   | Export as CSV         |
| GET    | `/api/export/workouts?format=json`  | Export as JSON        |

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel
```
Set the `VITE_API_URL` environment variable to your backend URL.

### Backend → Render / Railway
1. Create a new Web Service
2. Set the build command: `npm install && npx prisma generate && npm run build`
3. Set the start command: `npm start`
4. Add environment variables from `.env.example`

### Database → Neon PostgreSQL
1. Create a free database at [neon.tech](https://neon.tech)
2. Copy the connection string to `DATABASE_URL`

---

## 🔮 Future Improvements

- Social features (follow friends, share workouts)
- Workout templates and programs
- REST day recommendations
- Nutrition tracking
- Mobile app (React Native)
- Real-time notifications (WebSocket)
- OAuth (Google, GitHub login)
- Admin dashboard

---

## 📄 License

MIT License — feel free to use for hackathons, portfolios, and learning!
# Fitlytics
