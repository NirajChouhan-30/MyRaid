const { generateToken, verifyToken } = require('../jwtUtils');

// Set up test environment variable
process.env.JWT_SECRET = 'test-secret-key-for-testing';

describe('JWT Utilities', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = { id: '123', email: 'test@example.com' };
      const token = generateToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });
    
    it('should throw error if JWT_SECRET is not defined', () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;
      
      expect(() => {
        generateToken({ id: '123' });
      }).toThrow('JWT_SECRET is not defined');
      
      process.env.JWT_SECRET = originalSecret;
    });
  });
  
  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const payload = { id: '123', email: 'test@example.com' };
      const token = generateToken(payload);
      const decoded = verifyToken(token);
      
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.exp).toBeDefined(); // Expiration should be set
    });
    
    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => {
        verifyToken(invalidToken);
      }).toThrow();
    });
    
    it('should throw error if JWT_SECRET is not defined', () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;
      
      expect(() => {
        verifyToken('some.token.here');
      }).toThrow('JWT_SECRET is not defined');
      
      process.env.JWT_SECRET = originalSecret;
    });
  });
});
