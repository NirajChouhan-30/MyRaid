# Task Management Application

A full-stack task management application with user authentication, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- 🔐 Secure user authentication with JWT
- ✅ Create, read, update, and delete tasks
- 🔍 Search and filter tasks
- 📄 Pagination for large task lists
- 🎨 Clean and responsive UI
- 🔒 HTTP-only cookie-based authentication
- 🛡️ Security best practices (CORS, Helmet, input validation)

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- bcrypt for password hashing
- express-validator for input validation

### Frontend
- React 19
- Vite
- React Router v7
- Axios
- Context API for state management

## Quick Start

### Prerequisites

- Node.js 16 or higher
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

3. **Set up the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your backend URL
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Health Check: http://localhost:5000/health

## Project Structure

```
task-management-app/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   └── vite.config.js     # Vite configuration
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_secure_random_string
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ENFORCE_HTTPS=false
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all tasks (with pagination, filtering, search)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Health
- `GET /health` - Server health check

## Development

### Running Tests

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

## Security Features

- Passwords hashed with bcrypt
- JWT tokens stored in HTTP-only cookies
- CORS protection
- Input validation and sanitization
- Security headers with Helmet
- HTTPS enforcement in production
- Protection against common vulnerabilities (XSS, CSRF, injection)
