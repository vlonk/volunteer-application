const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const { getAllUsers, getProfile, updateProfile } = require('../controllers/profileController');

// Mock Express-like response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock('../models/userModel'); // Mock User model

describe('Profile Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close DB connection if needed
  });

  // Test: Get All Users
  test('getAllUsers should return all users', async () => {
    const mockUsers = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ];
    
    User.find.mockResolvedValue(mockUsers);
    
    const req = {}; // Empty request
    const res = mockResponse();

    await getAllUsers(req, res);

    expect(User.find).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  // Test: Get Profile by ID
  test('getProfile should return user when found', async () => {
    const mockUser = { id: '1', name: 'Alice' };

    User.findOne.mockResolvedValue(mockUser);

    const req = { params: { id: '1' } };
    const res = mockResponse();

    await getProfile(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ id: '1' });
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('getProfile should return 404 if user not found', async () => {
    User.findOne.mockResolvedValue(null);

    const req = { params: { id: '999' } };
    const res = mockResponse();

    await getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  // Test: Update Profile
  test('updateProfile should update user successfully', async () => {
    const mockUser = { id: '1', name: 'Alice', email: 'alice@example.com' };
    const updatedUser = { id: '1', name: 'Alice Smith', email: 'alice@example.com' };

    User.findOneAndUpdate.mockResolvedValue(updatedUser);

    const req = {
      params: { id: '1' },
      body: { name: 'Alice Smith', role: 'admin' } // 'role' should be ignored
    };
    const res = mockResponse();

    await updateProfile(req, res);

    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { id: '1' },
      { $set: { name: 'Alice Smith' } }, // 'role' should not be modified
      { new: true, runValidators: true }
    );
    expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated successfully', user: updatedUser });
  });

  test('updateProfile should return 404 if user not found', async () => {
    User.findOneAndUpdate.mockResolvedValue(null);

    const req = { params: { id: '999' }, body: { name: 'Unknown' } };
    const res = mockResponse();

    await updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('updateProfile should return 500 on error', async () => {
    User.findOneAndUpdate.mockRejectedValue(new Error('DB Error'));

    const req = { params: { id: '1' }, body: { name: 'Error Test' } };
    const res = mockResponse();

    await updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error updating profile', error: expect.any(Object) });
  });
});
