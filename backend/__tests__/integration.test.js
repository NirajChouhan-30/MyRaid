const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');

// Set up test environment variables
process.env.JWT_SECRET = 'test-secret-key-for-integration-tests';
process.env.NODE_ENV = 'test';

// Test database setup
beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management-test';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
});

describe('Complete User Flow Integration Tests', () => {
  
  describe('Registration → Login → Create Task → View Tasks', () => {
    test('should complete full user journey successfully', async () => {
      // Step 1: Register a new user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123'
        });
      
      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.success).toBe(true);
      
      // Step 2: Login with the registered user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'newuser@example.com',
          password: 'password123'
        });
      
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      
      // Extract cookies for authenticated requests
      const cookies = loginResponse.headers['set-cookie'];
      
      // Step 3: Create a task
      const createTaskResponse = await request(app)
        .post('/api/tasks')
        .set('Cookie', cookies)
        .send({
          title: 'My First Task',
          description: 'This is a test task',
          status: 'pending'
        });
      
      expect(createTaskResponse.status).toBe(201);
      expect(createTaskResponse.body.success).toBe(true);
      expect(createTaskResponse.body.data.title).toBe('My First Task');
      
      // Step 4: View tasks
      const viewTasksResponse = await request(app)
        .get('/api/tasks')
        .set('Cookie', cookies);
      
      expect(viewTasksResponse.status).toBe(200);
      expect(viewTasksResponse.body.success).toBe(true);
      expect(viewTasksResponse.body.data).toHaveLength(1);
      expect(viewTasksResponse.body.data[0].title).toBe('My First Task');
    });
  });

  describe('Task Filtering and Search', () => {
    let cookies;
    
    beforeEach(async () => {
      // Register and login
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      
      cookies = loginResponse.headers['set-cookie'];
      
      // Create multiple tasks with different statuses
      await request(app)
        .post('/api/tasks')
        .set('Cookie', cookies)
        .send({
          title: 'Pending Task',
          description: 'This task is pending',
          status: 'pending'
        });
      
      await request(app)
        .post('/api/tasks')
        .set('Cookie', cookies)
        .send({
          title: 'In Progress Task',
          description: 'This task is in progress',
          status: 'in-progress'
        });
      
      await request(app)
        .post('/api/tasks')
        .set('Cookie', cookies)
        .send({
          title: 'Completed Task',
          description: 'This task is completed',
          status: 'completed'
        });
      
      await request(app)
        .post('/api/tasks')
        .set('Cookie', cookies)
        .send({
          title: 'Shopping List',
          description: 'Buy groceries',
          status: 'pending'
        });
    });
    
    test('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=pending')
        .set('Cookie', cookies);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every(task => task.status === 'pending')).toBe(true);
    });
    
    test('should search tasks by title', async () => {
      const response = await request(app)
        .get('/api/tasks?search=Shopping')
        .set('Cookie', cookies);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Shopping List');
    });
    
    test('should combine filtering and search', async () => {
      const response = await request(app)
        .get('/api/tasks?status=pending&search=Task')
        .set('Cookie', cookies);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Pending Task');
    });
    
    test('should paginate results', async () => {
      const response = await request(app)
        .get('/api/tasks?page=1&limit=2')
        .set('Cookie', cookies);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalCount).toBe(4);
      expect(response.body.pagination.totalPages).toBe(2);
    });
  });

  describe('Task Update and Delete', () => {
    let cookies;
    let taskId;
    
    beforeEach(async () => {
      // Register and login
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      
      cookies = loginResponse.headers['set-cookie'];
      
      // Create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Cookie', cookies)
        .send({
          title: 'Original Task',
          description: 'Original description',
          status: 'pending'
        });
      
      taskId = createResponse.body.data.id;
    });
    
    test('should update task successfully', async () => {
      const updateResponse = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Cookie', cookies)
        .send({
          title: 'Updated Task',
          description: 'Updated description',
          status: 'completed'
        });
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.title).toBe('Updated Task');
      expect(updateResponse.body.data.status).toBe('completed');
      
      // Verify the update persisted
      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Cookie', cookies);
      
      expect(getResponse.body.data.title).toBe('Updated Task');
    });
    
    test('should delete task successfully', async () => {
      const deleteResponse = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Cookie', cookies);
      
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
      
      // Verify the task is deleted
      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Cookie', cookies);
      
      expect(getResponse.status).toBe(404);
    });
  });

  describe('Error Scenarios', () => {
    test('should reject unauthenticated task creation', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Unauthorized Task',
          description: 'This should fail',
          status: 'pending'
        });
      
      expect(response.status).toBe(401);
    });
    
    test('should reject invalid task data', async () => {
      // Register and login
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      
      const cookies = loginResponse.headers['set-cookie'];
      
      const response = await request(app)
        .post('/api/tasks')
        .set('Cookie', cookies)
        .send({
          title: '', // Invalid: empty title
          description: 'Test',
          status: 'pending'
        });
      
      expect(response.status).toBe(400);
    });
    
    test('should reject access to another user\'s task', async () => {
      // Create first user and task
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user1@example.com',
          password: 'password123'
        });
      
      const login1Response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user1@example.com',
          password: 'password123'
        });
      
      const cookies1 = login1Response.headers['set-cookie'];
      
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Cookie', cookies1)
        .send({
          title: 'User 1 Task',
          description: 'This belongs to user 1',
          status: 'pending'
        });
      
      const taskId = createResponse.body.data.id;
      
      // Create second user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user2@example.com',
          password: 'password123'
        });
      
      const login2Response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user2@example.com',
          password: 'password123'
        });
      
      const cookies2 = login2Response.headers['set-cookie'];
      
      // Try to access user 1's task as user 2
      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Cookie', cookies2);
      
      expect(getResponse.status).toBe(404);
      
      // Try to update user 1's task as user 2
      const updateResponse = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Cookie', cookies2)
        .send({
          title: 'Hacked Task'
        });
      
      expect(updateResponse.status).toBe(403);
      
      // Try to delete user 1's task as user 2
      const deleteResponse = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Cookie', cookies2);
      
      expect(deleteResponse.status).toBe(403);
    });
  });

  describe('Authentication Flows', () => {
    test('should handle logout correctly', async () => {
      // Register and login
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      
      const cookies = loginResponse.headers['set-cookie'];
      
      // Verify authenticated access works
      const tasksResponse1 = await request(app)
        .get('/api/tasks')
        .set('Cookie', cookies);
      
      expect(tasksResponse1.status).toBe(200);
      
      // Logout
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);
      
      expect(logoutResponse.status).toBe(200);
      
      // Verify authenticated access no longer works
      const tasksResponse2 = await request(app)
        .get('/api/tasks')
        .set('Cookie', logoutResponse.headers['set-cookie']);
      
      expect(tasksResponse2.status).toBe(401);
    });
    
    test('should reject duplicate registration', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123'
      };
      
      // First registration
      const response1 = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response1.status).toBe(201);
      
      // Duplicate registration
      const response2 = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response2.status).toBe(400);
      expect(response2.body.success).toBe(false);
    });
    
    test('should reject login with wrong password', async () => {
      // Register
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'correctpassword'
        });
      
      // Try to login with wrong password
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword'
        });
      
      expect(loginResponse.status).toBe(401);
      expect(loginResponse.body.success).toBe(false);
    });
  });
});
