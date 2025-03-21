const { getAllNotifications, getNotification, deleteNotification, postNotification } = require('../controllers/notificationController');
const Notification = require('../models/notificationModel');

// Mock Mongoose methods
jest.mock('../models/notificationModel');

describe('Notification Controller Tests', () => {

  beforeEach(() => {
    // Reset the mock methods before each test
    Notification.find.mockReset();
    Notification.findOne.mockReset();
    Notification.findOneAndDelete.mockReset();
    Notification.prototype.save.mockReset();
  });

  test('getAllNotifications should return all notifications for a user', async () => {
    const mockNotifications = [
      { notificationid: '1', userid: '1', message: 'Test Notification 1', status: 'Unread' },
      { notificationid: '2', userid: '1', message: 'Test Notification 2', status: 'Read' }
    ];

    Notification.find.mockResolvedValueOnce(mockNotifications);

    const req = { params: { userid: '1' } };  // Passing userId as parameter
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getAllNotifications(req, res);
    expect(res.json).toHaveBeenCalledWith(mockNotifications);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('getAllNotifications should return 404 if no notifications found for the user', async () => {
    Notification.find.mockResolvedValueOnce([]);

    const req = { params: { userid: '1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getAllNotifications(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No notifications found for this user' });
  });

  test('getNotification should return a notification by ID', async () => {
    const mockNotification = { notificationid: '1', userid: '1', message: 'Test Notification', status: 'Unread' };

    Notification.findOne.mockResolvedValueOnce(mockNotification);

    const req = { params: { id: '1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getNotification(req, res);
    expect(res.json).toHaveBeenCalledWith(mockNotification);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('getNotification should return 404 if notification not found', async () => {
    Notification.findOne.mockResolvedValueOnce(null);

    const req = { params: { id: '999' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Notification not found' });
  });

  test('deleteNotification should delete a notification', async () => {
    const mockNotification = { notificationid: '1', userid: '1', message: 'Test Notification', status: 'Unread' };

    Notification.findOneAndDelete.mockResolvedValueOnce(mockNotification);

    const req = { params: { id: '1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await deleteNotification(req, res);
    expect(Notification.findOneAndDelete).toHaveBeenCalledWith({ notificationid: '1' });
    expect(res.json).toHaveBeenCalledWith({
      message: 'Notification deleted successfully'
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('deleteNotification should return 404 if notification not found to delete', async () => {
    Notification.findOneAndDelete.mockResolvedValueOnce(null);

    const req = { params: { id: '999' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await deleteNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Notification not found' });
  });

  test('postNotification should create a new notification', async () => {
    const newNotification = { userid: '1', message: 'New Test Notification', eventid: '123' };
    const mockNotification = { notificationid: '3', ...newNotification, status: 'Unread', timestamp: new Date() };

    Notification.prototype.save.mockResolvedValueOnce(mockNotification);

    const req = { body: newNotification };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await postNotification(req, res);
    expect(Notification.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Notification created successfully',
      notification: mockNotification
    });
  });

  test('postNotification should return 400 if missing required fields', async () => {
    const req = { body: { userid: '1', message: '' } };  // Missing eventid
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await postNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing required fields: userid, message, or eventid"
    });
  });

  test('postNotification should handle errors gracefully', async () => {
    Notification.prototype.save.mockRejectedValueOnce(new Error('Database error'));

    const req = { body: { userid: '1', message: 'Faulty Notification', eventid: '123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await postNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error creating notification',
      error: 'Database error'
    });
  });

});
