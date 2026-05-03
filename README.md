# ZenTask — Full-Stack Team Task Manager

A modern project management platform with Kanban boards, role-based access control, and a dashboard built with React + Node.js + MySQL.

**Live:** https://zen-task-full-stack.vercel.app

---

## Features

- **Dashboard** — project stats and activity charts (Recharts)
- **Kanban Board** — drag-and-drop task management (@hello-pangea/dnd)
- **Project Management** — create, view, and manage multiple projects
- **JWT Authentication** — secure login with bcrypt password hashing
- **Role-Based Access** — admin and member roles with protected routes
- **Page Transitions** — animated navigation with shimmer loading states
- **Dark Mode UI** — glassmorphism-inspired design

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Recharts (data visualization)
- @hello-pangea/dnd (drag-and-drop Kanban)
- React Router DOM v6
- Axios

**Backend**
- Node.js + Express 5
- MySQL2
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

---

## Project Structure

```
zentask/
├── client/          # React + Vite frontend
│   └── src/
│       ├── pages/   # Dashboard, Projects, Kanban, Settings
│       ├── components/
│       └── context/ # Auth context
└── server/          # Node.js + Express backend
    ├── routes/      # auth, projects, tasks
    ├── middleware/  # JWT auth, role check
    └── config/      # MySQL connection
```

---

## Setup

**Prerequisites:** Node.js 18+, MySQL

```bash
# Clone
git clone https://github.com/Ayush-dev-ops/ZenTask_full_stack.git
cd ZenTask_full_stack

# Backend
cd server
cp .env.example .env      # add DB credentials and JWT_SECRET
npm install
npm start                  # runs setup.js (creates tables) then server

# Frontend
cd ../client
npm install
npm run dev
```

**.env variables (server)**
```
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=zentask
JWT_SECRET=yoursecret
PORT=5000
```

---

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/signup` | — | Register with role |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/projects` | JWT | List all projects |
| POST | `/api/projects` | JWT + Admin | Create project |
| GET | `/api/tasks/:projectId` | JWT | Get tasks for project |
| POST | `/api/tasks` | JWT | Create task |
| PATCH | `/api/tasks/:id` | JWT | Update task / move column |

---

## Author

**Ayush Bhardwaj** — [github.com/Ayush-dev-ops](https://github.com/Ayush-dev-ops)
