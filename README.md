# ZenTask

> Work with clarity. Execute with focus.

ZenTask is a modern, full-stack team task management platform. It offers an elegant, glassmorphism-inspired dark mode interface that helps teams track projects, manage tasks via Kanban boards, and stay aligned in real-time.

## 🚀 Features

- **Project Management**: Create, view, and manage projects with ease.
- **Interactive Kanban Boards**: Drag-and-drop tasks across customizable columns (To Do, In Progress, Done).
- **Dashboard Analytics**: Real-time insights into task completion and overdue items.
- **Role-Based Access**: Secure JWT authentication supporting `admin` and `member` roles.
- **Glassmorphism UI**: A gorgeous, highly-responsive dark-themed user interface built with Tailwind CSS.

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- @hello-pangea/dnd (for Kanban drag-and-drop)
- Axios

**Backend:**
- Node.js & Express.js
- MySQL (Database)
- JSON Web Tokens (JWT) for Authentication
- Bcrypt.js for secure password hashing

## 📂 Folder Structure

```
zentask/
├── client/           # React Frontend Application
│   ├── src/          # Components, Pages, Context, Hooks
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
└── server/           # Node/Express Backend API
    ├── routes/       # API endpoints (auth, projects, tasks)
    ├── middleware/   # JWT and role validation
    ├── config/       # Database connection
    └── package.json  # Backend dependencies
```

## 💻 Local Development

### Prerequisites
- Node.js (v18+)
- MySQL Server

### Backend Setup
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `server` directory with the following credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_NAME=ethara
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend development server: `npm run dev`

### Frontend Setup
1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Ensure the backend URL in `src/services/api.js` points to `http://localhost:5000/api`.
4. Start the frontend development server: `npm run dev`

## 🌍 Live Demo

Want to see ZenTask in action? We've successfully deployed it!

**[✨ Try ZenTask Live on Vercel](https://zen-task-full-stack.vercel.app/)**

*(Note: The backend is hosted on Railway, so if it hasn't been used in a while, it might take a few seconds to wake up on your first login!)*

---
*Built with ❤️ for teams who value focus and precision.*
