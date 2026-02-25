# Task Management Frontend

Modern React-based frontend for the Task Management Application built with Vite.

## Features

- User authentication (register, login, logout)
- Task management (create, read, update, delete)
- Task filtering by status
- Task search functionality
- Pagination for task lists
- Protected routes
- Responsive design
- Clean and intuitive UI

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Testing**: Vitest + React Testing Library

## Prerequisites

- Node.js 16+
- npm or yarn
- Backend API running (see backend README)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your backend API URL:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

## Running Locally

### Development Mode

```bash
npm run dev
```

The app will start on `http://localhost:5173` with hot module replacement.

### Production Build

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
frontend/
├── public/
│   ├── _redirects           # Netlify SPA routing config
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx    # Login form component
│   │   ├── RegisterForm.jsx # Registration form component
│   │   ├── Navigation.jsx   # Navigation bar
│   │   ├── ProtectedRoute.jsx # Route protection
│   │   ├── TaskForm.jsx     # Task creation/edit form
│   │   ├── TaskItem.jsx     # Individual task display
│   │   └── TaskList.jsx     # Task list with filters
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/
│   │   ├── LoginPage.jsx    # Login page
│   │   ├── RegisterPage.jsx # Registration page
│   │   └── TasksPage.jsx    # Main tasks page
│   ├── services/
│   │   ├── authService.js   # Authentication API calls
│   │   └── taskService.js   # Task API calls
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── .env.example             # Environment variables template
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel deployment config
├── netlify.toml             # Netlify deployment config
└── package.json             # Dependencies and scripts
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | - |

**Note**: Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client.

## Deployment

See the main [DEPLOYMENT.md](../DEPLOYMENT.md) file for detailed deployment instructions.

### Quick Deployment Steps

#### Deploy to Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel](https://vercel.com) and import your repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
5. Deploy

#### Deploy to Netlify

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://netlify.com) and import your repository
3. Configure:
   - **Base Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `frontend/dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
5. Deploy

## Features Overview

### Authentication

- **Register**: Create a new account with email and password
- **Login**: Authenticate with credentials
- **Logout**: Clear authentication and redirect to login
- **Protected Routes**: Automatic redirect to login for unauthenticated users

### Task Management

- **Create Tasks**: Add new tasks with title, description, and status
- **View Tasks**: See all your tasks in a paginated list
- **Update Tasks**: Edit task details and change status
- **Delete Tasks**: Remove tasks with confirmation
- **Filter by Status**: Show only pending, in-progress, or completed tasks
- **Search**: Find tasks by title
- **Pagination**: Navigate through large task lists

## API Integration

The frontend communicates with the backend API using Axios with the following configuration:

- **Base URL**: Set via `VITE_API_URL` environment variable
- **Credentials**: Cookies sent with every request (`withCredentials: true`)
- **Content Type**: JSON

### API Endpoints Used

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/tasks` - Get tasks (with pagination, filtering, search)
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Common Issues

### API Connection Failed

- Verify backend is running
- Check `VITE_API_URL` is correct
- Ensure CORS is configured on backend

### Authentication Not Working

- Check cookies are enabled in browser
- Verify backend sets HTTP-only cookies
- Ensure both frontend and backend use HTTPS in production

### Build Fails

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for ESLint errors: `npm run lint`
- Verify all dependencies are installed

## Development Tips

### Hot Module Replacement

Vite provides instant HMR. Changes to components will reflect immediately without full page reload.

### Code Splitting

The build automatically splits code by routes for optimal loading performance.

### Environment Variables

- Development: Use `.env` file
- Production: Set via deployment platform
- Always prefix with `VITE_` for client-side access

## License

MIT
