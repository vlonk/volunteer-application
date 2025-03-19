const request = require('supertest');
const app = require('../app'); // Import your express app (assuming you have one set up)
const User = require('../models/userModel');

// Mock Mongoose methods
jest.mock('../models/userModel');

// Test suite
describe('User Controller', () => {
  // Test for getAllUsers
  describe('GET /users', () => {
    it('should return all users', async () => {
      // Mock the data returned by Mongoose
      const mockUsers = [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Doe' }];
      User.find.mockResolvedValue(mockUsers);

      const response = await request(app).get('/users'); // Make GET request to /users
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    it('should return a 500 error if there is an issue fetching users', async () => {
      User.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users');
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error fetching all users');
    });
  });

  // Test for getProfile
  describe('GET /users/:id', () => {
    it('should return a user by ID', async () => {
      const mockUser = { id: '1', name: 'John Doe' };
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app).get('/users/1'); // Make GET request to /users/1
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return a 404 if user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).get('/users/1');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return a 500 error if there is an issue fetching the user profile', async () => {
      User.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users/1');
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error fetching user profile');
    });
  });

  // Test for updateProfile
  describe('PUT /users/:id', () => {
    it('should update a user profile', async () => {
      const updatedData = { name: 'John Updated' };
      const mockUpdatedUser = { id: '1', name: 'John Updated' };
      User.findOneAndUpdate.mockResolvedValue(mockUpdatedUser);

      const response = await request(app)
        .put('/users/1') // Make PUT request to /users/1
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile updated successfully');
      expect(response.body.user).toEqual(mockUpdatedUser);
    });

    it('should return a 404 if user is not found', async () => {
      User.findOneAndUpdate.mockResolvedValue(null);

      const updatedData = { name: 'John Updated' };
      const response = await request(app)
        .put('/users/1')
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return a 500 error if there is an issue updating the profile', async () => {
      User.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      const updatedData = { name: 'John Updated' };
      const response = await request(app)
        .put('/users/1')
        .send(updatedData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error updating profile');
    });

    it('should prevent updating id and role', async () => {
      const updatedData = { id: '123', role: 'admin', name: 'John Updated' };
      const mockUpdatedUser = { id: '1', name: 'John Updated' };
      User.findOneAndUpdate.mockResolvedValue(mockUpdatedUser);

      const response = await request(app)
        .put('/users/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile updated successfully');
      expect(response.body.user).toEqual(mockUpdatedUser);
      expect(response.body.user.id).not.toBe(updatedData.id); // Ensure id was not updated
      expect(response.body.user.role).not.toBe(updatedData.role); // Ensure role was not updated
    });
  });
});
