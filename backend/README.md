# Task Management Backend

RESTful API backend for the Task Management Application built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT tokens
- Secure password hashing with bcrypt
- Task CRUD operations
- Task filtering, searching, and pagination
- HTTP-only cookie-based authentication
- Comprehensive error handling
- Security best practices (CORS, Helmet, input validation)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt, helmet, express-validator
- **Testing**: Jest

## Prerequisites

- Node.js 16+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=your_secure_random_string_here
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ENFORCE_HTTPS=false
   ```

## Running Locally

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:5000` with auto-reload enabled.

### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tasks

- `POST /api/tasks` - Create a new task (authenticated)
- `GET /api/tasks` - Get all tasks for user (authenticated)
  - Query params: `page`, `limit`, `status`, `search`
- `GET /api/tasks/:id` - Get single task (authenticated)
- `PUT /api/tasks/:id` - Update task (authenticated)
- `DELETE /api/tasks/:id` - Delete task (authenticated)

### Health Check

- `GET /health` - Server health status

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `5000` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret for JWT signing | Yes | - |
| `NODE_ENV` | Environment mode | No | `development` |
| `FRONTEND_URL` | Frontend URL(s) for CORS | Yes | - |
| `ENFORCE_HTTPS` | Enable HTTPS enforcement | No | `false` |

### Generating JWT Secret

Generate a secure random string for production:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
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
backend/
├── config/
│   ├── cookieConfig.js      # Cookie configuration
│   ├── database.js          # MongoDB connection
│   └── production.js        # Production environment validation
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── taskController.js    # Task management logic
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Error handling middleware
│   └── validation.js        # Input validation middleware
├── models/
│   ├── User.js              # User model
│   └── Task.js              # Task model
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   └── taskRoutes.js        # Task routes
├── utils/
│   ├── jwtUtils.js          # JWT utilities
│   └── passwordUtils.js     # Password hashing utilities
├── .env.example             # Environment variables template
├── server.js                # Application entry point
└── package.json             # Dependencies and scripts
```

## Deployment

See the main [DEPLOYMENT.md](../DEPLOYMENT.md) file for detailed deployment instructions.

### Quick Deployment Steps

1. **Set up MongoDB Atlas** (see DEPLOYMENT.md)

2. **Deploy to Render/Railway/Heroku**:
   - Connect your Git repository
   - Set root directory to `backend`
   - Configure environment variables
   - Deploy

3. **Required Environment Variables for Production**:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   JWT_SECRET=<64-character-random-string>
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.com
   ENFORCE_HTTPS=true
   ```

## Security Features

- **Password Security**: Passwords hashed with bcrypt (10 salt rounds)
- **JWT Authentication**: Tokens stored in HTTP-only cookies
- **CORS Protection**: Configured for specific frontend origins
- **Input Validation**: All inputs validated and sanitized
- **Security Headers**: Helmet.js for security headers
- **HTTPS Enforcement**: Automatic redirect in production
- **Error Handling**: No sensitive information in error responses

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "statusCode": 400
}
```

## Common Issues

### Database Connection Failed

- Verify MongoDB is running
- Check `MONGODB_URI` is correct
- For MongoDB Atlas, verify network access and credentials

### CORS Errors

- Ensure `FRONTEND_URL` matches your frontend URL exactly
- Check that frontend sends `withCredentials: true`

### JWT/Authentication Issues

- Verify `JWT_SECRET` is set
- Check cookies are being sent with requests
- Ensure HTTPS in production

## License

MIT
