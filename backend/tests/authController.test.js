/**
 * __tests__/authController.test.js
 * Tests for authController.js using Jest.
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signup, login } = require('../controllers/authController');
const User = require('../models/userModel');

// Mock bcrypt methods
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('fakeHashedPassword'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock jwt.sign to return a fake token
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fakeJWT')
}));

describe('Auth Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('signup', () => {
    it('should return 400 if email or password is missing', async () => {
      req.body = { email: '', password: '' };
      await signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Email and password are required.' });
    });

    it('should return 400 if user already exists', async () => {
      req.body = { email: 'existing@example.com', password: 'test123' };
      // Mock User.findOne to return a user (simulate duplicate)
      jest.spyOn(User, 'findOne').mockResolvedValueOnce({ email: 'existing@example.com' });
      await signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'User already exists with that email.' });
    });

    it('should create a new user and return 201 with a token', async () => {
      req.body = { email: 'newuser@example.com', password: 'test123', name: 'Test User' };
      // Mock User.findOne to return null (no duplicate)
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
      // Mock User.create to return a fake user object
      const fakeUser = {
        id: '12345',
        email: 'newuser@example.com',
        role: 'user'
      };
      jest.spyOn(User, 'create').mockResolvedValueOnce(fakeUser);
      
      await signup(req, res);
      
      // Verify that bcrypt.hash was called with the provided password and salt rounds 10.
      expect(bcrypt.hash).toHaveBeenCalledWith('test123', 10);
      
      // Expect a successful response with 201 status and a token.
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        msg: 'User registered successfully',
        token: 'fakeJWT'
      }));
    });

    it('should return 500 if an error occurs during signup', async () => {
      req.body = { email: 'error@example.com', password: 'test123' };
      // Force an error in User.findOne
      jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('DB error'));
      await signup(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
    });
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      req.body = { email: '', password: '' };
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'email and password are required.' });
    });

    it('should return 400 if user is not found', async () => {
      req.body = { email: 'notfound@example.com', password: 'test123' };
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
    });

    it('should return 400 if password does not match', async () => {
      req.body = { email: 'existing@example.com', password: 'wrongpassword' };
      const fakeUser = { id: '12345', email: 'existing@example.com', role: 'user', password: 'fakeHashedPassword' };
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(fakeUser);
      // Override bcrypt.compare to return false
      bcrypt.compare.mockResolvedValueOnce(false);
      await login(req, res);
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'fakeHashedPassword');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
    });

    it('should login successfully with correct credentials', async () => {
      req.body = { email: 'existing@example.com', password: 'correctpassword' };
      const fakeUser = { id: '12345', email: 'existing@example.com', role: 'user', password: 'fakeHashedPassword' };
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(fakeUser);
      bcrypt.compare.mockResolvedValueOnce(true);
      await login(req, res);
      expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'fakeHashedPassword');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        msg: 'Login successful',
        token: 'fakeJWT',
        id: '12345'
      }));
    });

    it('should return 500 if an error occurs during login', async () => {
      req.body = { email: 'error@example.com', password: 'test123' };
      jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('DB error in login'));
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
    });
  });
});
