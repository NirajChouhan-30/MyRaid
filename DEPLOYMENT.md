# Deployment Guide

This guide provides step-by-step instructions for deploying the Task Management Application to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js 16+ installed locally
- Git repository with your code
- MongoDB Atlas account (free tier available)
- Accounts on deployment platforms:
  - Backend: Render, Railway, or Heroku
  - Frontend: Vercel or Netlify

## Environment Variables

### Backend Environment Variables

The following environment variables are required for the backend:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port (usually set by platform) | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/taskdb` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `NODE_ENV` | Environment mode | `production` |
| `FRONTEND_URL` | Frontend URL(s), comma-separated | `https://your-app.vercel.app` |
| `ENFORCE_HTTPS` | Enable HTTPS enforcement | `true` |

### Frontend Environment Variables

The following environment variables are required for the frontend:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.onrender.com` |

## MongoDB Atlas Setup

### Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new organization (if needed)

### Step 2: Create a Cluster

1. Click "Build a Cluster"
2. Select the **FREE** tier (M0 Sandbox)
3. Choose a cloud provider and region (select one close to your backend deployment)
4. Name your cluster (e.g., `task-management-cluster`)
5. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Create Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username and generate a strong password
5. Set user privileges to "Read and write to any database"
6. Click "Add User"
7. **Save the username and password securely**

### Step 4: Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your backend server's IP address
5. Click "Confirm"

### Step 5: Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Choose "Node.js" as driver and latest version
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with your database name (e.g., `taskmanagement`)

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
```

## Backend Deployment

### Option 1: Deploy to Render (Recommended)

#### Step 1: Prepare Repository

1. Ensure your code is pushed to GitHub, GitLab, or Bitbucket
2. Make sure `backend/package.json` has a start script:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

#### Step 2: Create Render Account

1. Go to [Render](https://render.com)
2. Sign up and connect your Git provider

#### Step 3: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure the service:
   - **Name**: `task-management-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main` or `master`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

#### Step 4: Add Environment Variables

In the "Environment" section, add all backend environment variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement
JWT_SECRET=<your-generated-secret>
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
ENFORCE_HTTPS=true
```

#### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Note your backend URL: `https://task-management-backend.onrender.com`

### Option 2: Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Sign up and create a new project
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Configure root directory to `backend`
6. Add environment variables
7. Deploy

### Option 3: Deploy to Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create task-management-backend`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=<your-mongodb-uri>
   heroku config:set JWT_SECRET=<your-secret>
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=<your-frontend-url>
   heroku config:set ENFORCE_HTTPS=true
   ```
5. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Prepare Repository

1. Ensure your code is pushed to GitHub, GitLab, or Bitbucket
2. Verify `frontend/package.json` has build script:
   ```json
   "scripts": {
     "build": "vite build"
   }
   ```

#### Step 2: Create Vercel Account

1. Go to [Vercel](https://vercel.com)
2. Sign up and connect your Git provider

#### Step 3: Import Project

1. Click "Add New..." → "Project"
2. Import your repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Step 4: Add Environment Variables

In the "Environment Variables" section:

```
VITE_API_URL=https://your-backend.onrender.com
```

#### Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment to complete (2-5 minutes)
3. Note your frontend URL: `https://your-app.vercel.app`

#### Step 6: Update Backend FRONTEND_URL

Go back to your backend deployment (Render) and update the `FRONTEND_URL` environment variable with your Vercel URL.

### Option 2: Deploy to Netlify

#### Step 1: Create Netlify Account

1. Go to [Netlify](https://netlify.com)
2. Sign up and connect your Git provider

#### Step 2: Create New Site

1. Click "Add new site" → "Import an existing project"
2. Connect your repository
3. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

#### Step 3: Add Environment Variables

In "Site settings" → "Environment variables":

```
VITE_API_URL=https://your-backend.onrender.com
```

#### Step 4: Deploy

1. Click "Deploy site"
2. Wait for deployment to complete
3. Note your frontend URL

#### Step 5: Update Backend FRONTEND_URL

Update your backend's `FRONTEND_URL` environment variable with your Netlify URL.

## Post-Deployment Verification

### 1. Check Backend Health

Visit your backend health endpoint:
```
https://your-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-02-25T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "database": "connected"
}
```

### 2. Test Frontend

1. Visit your frontend URL
2. Try registering a new account
3. Log in with the account
4. Create a task
5. Update and delete the task
6. Test filtering and search

### 3. Verify HTTPS

1. Ensure both URLs use HTTPS
2. Check that cookies are being set correctly
3. Verify CORS is working (no console errors)

### 4. Check Logs

**Render:**
- Go to your service dashboard
- Click "Logs" tab
- Look for any errors

**Vercel:**
- Go to your project dashboard
- Click "Deployments"
- Click on latest deployment
- Check "Functions" logs

## Troubleshooting

### Backend Issues

#### Database Connection Fails

**Problem**: Backend can't connect to MongoDB

**Solutions**:
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas network access allows your backend IP
3. Verify database user credentials are correct
4. Check MongoDB Atlas cluster is running

#### CORS Errors

**Problem**: Frontend can't make requests to backend

**Solutions**:
1. Verify `FRONTEND_URL` in backend matches your frontend URL exactly
2. Check that `withCredentials: true` is set in frontend axios config
3. Ensure backend CORS is configured correctly
4. Check browser console for specific CORS error

#### JWT/Cookie Issues

**Problem**: Authentication not working

**Solutions**:
1. Verify `JWT_SECRET` is set and at least 32 characters
2. Check that cookies have `Secure` flag in production
3. Ensure both frontend and backend use HTTPS
4. Verify `SameSite` cookie attribute is compatible

### Frontend Issues

#### API Requests Fail

**Problem**: Frontend can't reach backend

**Solutions**:
1. Verify `VITE_API_URL` is set correctly
2. Check backend is running and accessible
3. Verify CORS configuration
4. Check browser network tab for errors

#### Build Fails

**Problem**: Frontend build fails during deployment

**Solutions**:
1. Check for TypeScript/ESLint errors locally
2. Verify all dependencies are in `package.json`
3. Check build logs for specific errors
4. Try building locally: `npm run build`

#### Routing Issues

**Problem**: Page refresh returns 404

**Solutions**:
1. Verify `_redirects` file exists in `frontend/public/`
2. For Vercel: Check `vercel.json` is configured
3. For Netlify: Check `netlify.toml` is configured
4. Ensure SPA routing is enabled on platform

### General Issues

#### Environment Variables Not Working

**Problem**: App behaves as if env vars aren't set

**Solutions**:
1. Verify variable names are correct (case-sensitive)
2. For Vite: Ensure variables start with `VITE_`
3. Restart/redeploy after changing env vars
4. Check platform-specific env var syntax

#### Performance Issues

**Problem**: App is slow

**Solutions**:
1. Check database indexes are created
2. Verify backend instance isn't sleeping (free tier)
3. Consider upgrading to paid tier
4. Enable caching where appropriate
5. Optimize database queries

## Security Checklist

Before going live, verify:

- [ ] `JWT_SECRET` is strong and unique (64+ characters)
- [ ] `NODE_ENV` is set to `production`
- [ ] HTTPS is enforced on both frontend and backend
- [ ] MongoDB Atlas network access is restricted (not 0.0.0.0/0)
- [ ] Database user has minimal required permissions
- [ ] Environment variables are not committed to Git
- [ ] CORS is configured for specific frontend URL only
- [ ] Cookies have `HttpOnly`, `Secure`, and `SameSite` flags
- [ ] Error messages don't expose sensitive information
- [ ] Rate limiting is considered for production use

## Maintenance

### Updating the Application

1. Push changes to your Git repository
2. Platforms will auto-deploy (if enabled)
3. Monitor logs for errors
4. Test functionality after deployment

### Monitoring

- Set up uptime monitoring (e.g., UptimeRobot)
- Monitor error logs regularly
- Check database performance in MongoDB Atlas
- Set up alerts for critical errors

### Backup

- MongoDB Atlas provides automatic backups
- Consider exporting important data periodically
- Keep environment variables documented securely

## Support

For issues:
1. Check logs on deployment platform
2. Review MongoDB Atlas metrics
3. Test locally with production environment variables
4. Check platform-specific documentation:
   - [Render Docs](https://render.com/docs)
   - [Vercel Docs](https://vercel.com/docs)
   - [Netlify Docs](https://docs.netlify.com)
   - [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
