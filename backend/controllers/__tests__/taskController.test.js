const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');
const Task = require('../../models/Task');

// Set up test environment variables
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.NODE_ENV = 'test';

// Connect to test database before tests
beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/task-management-test';
  await mongoose.connect(mongoUri);
});

// Clear database after each test
afterEach(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Helper function to register and login a user
async function registerAndLogin(email = 'test@example.com', password = 'password123') {
  // Register user
  await request(app)
    .post('/api/auth/register')
    .send({ email, password });

  // Login and get cookie
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  const cookies = loginResponse.headers['set-cookie'];
  return cookies;
}

// Helper function to create a task
async function createTask(cookies, taskData = {}) {
  const defaultTaskData = {
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    ...taskData
  };

  const response = await request(app)
    .post('/api/tasks')
    .set('Cookie', cookies)
    .send(defaultTaskData);

  return response.body.data;
}

describe('DELETE /api/tasks/:id', () => {
  test('should delete task successfully when user owns the task', async () => {
    const cookies = await registerAndLogin();
    const task = await createTask(cookies);

    const response = await request(app)
      .delete(`/api/tasks/${task.id}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Task deleted successfully');

    // Verify task was deleted from database
    const deletedTask = await Task.findById(task.id);
    expect(deletedTask).toBeNull();
  });

  test('should return 404 when task does not exist', async () => {
    const cookies = await registerAndLogin();
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/api/tasks/${nonExistentId}`)
      .set('Cookie', cookies)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('NOT_FOUND');
    expect(response.body.message).toBe('Task not found');
  });

  test('should return 403 when user tries to delete another user\'s task', async () => {
    // Create first user and their task
    const cookies1 = await registerAndLogin('user1@example.com', 'password123');
    const task = await createTask(cookies1);

    // Create second user
    const cookies2 = await registerAndLogin('user2@example.com', 'password123');

    // Try to delete first user's task as second user
    const response = await request(app)
      .delete(`/api/tasks/${task.id}`)
      .set('Cookie', cookies2)
      .expect(403);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('FORBIDDEN');
    expect(response.body.message).toBe('You are not authorized to delete this task');

    // Verify task was not deleted
    const taskStillExists = await Task.findById(task.id);
    expect(taskStillExists).toBeTruthy();
  });

  test('should return 401 when user is not authenticated', async () => {
    const cookies = await registerAndLogin();
    const task = await createTask(cookies);

    // Try to delete without authentication
    const response = await request(app)
      .delete(`/api/tasks/${task.id}`)
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('AUTHENTICATION_REQUIRED');

    // Verify task was not deleted
    const taskStillExists = await Task.findById(task.id);
    expect(taskStillExists).toBeTruthy();
  });

  test('should return 404 for invalid task ID format', async () => {
    const cookies = await registerAndLogin();

    const response = await request(app)
      .delete('/api/tasks/invalid-id')
      .set('Cookie', cookies)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('NOT_FOUND');
  });
});
