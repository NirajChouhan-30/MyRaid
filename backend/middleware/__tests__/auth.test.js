const authenticate = require('../auth');
const { generateToken } = require('../../utils/jwtUtils');

// Set up test environment variable
process.env.JWT_SECRET = 'test-secret-key-for-testing';

describe('Authentication Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      cookies: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });
  
  it('should call next() with valid token', () => {
    const payload = { id: '123', email: 'test@example.com' };
    const token = generateToken(payload);
    req.cookies.token = token;
    
    authenticate(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(payload.id);
    expect(req.user.email).toBe(payload.email);
  });
  
  it('should return 401 if no token provided', () => {
    authenticate(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'AUTHENTICATION_REQUIRED',
      message: 'Authentication token is required',
      statusCode: 401
    });
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should return 401 for invalid token', () => {
    req.cookies.token = 'invalid.token.here';
    
    authenticate(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: 401
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should handle userId field in token payload', () => {
    const payload = { userId: '456', email: 'user@example.com' };
    const token = generateToken(payload);
    req.cookies.token = token;
    
    authenticate(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe(payload.userId);
  });
});
