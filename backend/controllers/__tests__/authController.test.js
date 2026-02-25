const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');
const { hashPassword } = require('../../utils/passwordUtils');

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
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
  test('should register a new user with valid credentials', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.data).not.toHaveProperty('password');

    // Verify user was created in database
    const user = await User.findOne({ email: userData.email });
    expect(user).toBeTruthy();
    expect(user.password).not.toBe(userData.password); // Password should be hashed
  });

  test('should reject registration with invalid email format', async () => {
    const userData = {
      email: 'invalid-email',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('VALIDATION_ERROR');
  });

  test('should reject registration with password shorter than 8 characters', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'short'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('VALIDATION_ERROR');
  });

  test('should reject registration with duplicate email', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    // Register first user
    await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    // Try to register with same email
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('EMAIL_EXISTS');
  });

  test('should reject registration with missing email', async () => {
    const userData = {
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('VALIDATION_ERROR');
  });

  test('should reject registration with missing password', async () => {
    const userData = {
      email: 'test@example.com'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('VALIDATION_ERROR');
  });
});

describe('POST /api/auth/login', () => {
  test('should login user with valid credentials', async () => {
    // First register a user
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    // Now login
    const response = await request(app)
      .post('/api/auth/login')
      .send(userData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.data).not.toHaveProperty('password');

    // Verify cookie was set
    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some(cookie => cookie.startsWith('token='))).toBe(true);
  });

  test('should reject login with invalid email', async () => {
    const userData = {
      email: 'nonexistent@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(userData)
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('INVALID_CREDENTIALS');
  });

  test('should reject login with invalid password', async () => {
    // First register a user
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    // Try to login with wrong password
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: 'wrongpassword'
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('INVALID_CREDENTIALS');
  });

  test('should reject login with missing email', async () => {
    const userData = {
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(userData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('VALIDATION_ERROR');
  });

  test('should reject login with missing password', async () => {
    const userData = {
      email: 'test@example.com'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(userData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('VALIDATION_ERROR');
  });

  test('should reject login with invalid email format', async () => {
    const userData = {
      email: 'invalid-email',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(userData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('VALIDATION_ERROR');
  });
});

describe('POST /api/auth/logout', () => {
  test('should logout user and clear cookie', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Logout successful');

    // Verify cookie was cleared
    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some(cookie => cookie.includes('token=;'))).toBe(true);
  });
});
