const { getAllNotifications, getNotification, deleteNotification, postNotification } = require('../controllers/notificationController');
const Notification = require('../models/notificationModel');

// Mock Mongoose methods
jest.mock('../models/notificationModel');

describe('Notification Controller Tests', () => {

  beforeEach(() => {
    // Reset mock methods before each test
    Notification.find.mockReset();
    Notification.findOne.mockReset();
    Notification.findOneAndDelete.mockReset();
    Notification.prototype.save.mockReset();
  });

  // Test for getAllNotifications with notifications found
  test('getAllNotifications should return 200 if notifications are found', async () => {
    const notifications = [
      { notificationid: 'notif1', message: 'Test notification 1' },
      { notificationid: 'notif2', message: 'Test notification 2' }
    ];
    Notification.find.mockResolvedValueOnce(notifications);  // Simulate notifications found

    const req = { params: { userid: '1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getAllNotifications(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(notifications);
  });

  // Test for getAllNotifications with no notifications found
  test('getAllNotifications should return 404 if no notifications are found', async () => {
    Notification.find.mockResolvedValueOnce([]);  // Simulate no notifications found

    const req = { params: { userid: '1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getAllNotifications(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No notifications found for this user'
    });
  });

  // Test for getNotification when found
  test('getNotification should return 200 if notification is found', async () => {
    const notification = { notificationid: 'notif1', message: 'Test notification' };
    Notification.findOne.mockResolvedValueOnce(notification);  // Simulate notification found

    const req = { params: { id: 'notif1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(notification);
  });

  // Test for getNotification when not found
  test('getNotification should return 404 if notification is not found', async () => {
    Notification.findOne.mockResolvedValueOnce(null);  // Simulate notification not found

    const req = { params: { id: 'notif1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Notification not found'
    });
  });

  // Test for deleteNotification when deleted
  test('deleteNotification should return 200 if notification is successfully deleted', async () => {
    const deletedNotification = { notificationid: 'notif1' };
    Notification.findOneAndDelete.mockResolvedValueOnce(deletedNotification);  // Simulate notification deletion

    const req = { params: { id: 'notif1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await deleteNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Notification deleted successfully'
    });
  });

  // Test for deleteNotification when not found
  test('deleteNotification should return 404 if notification is not found', async () => {
    Notification.findOneAndDelete.mockResolvedValueOnce(null);  // Simulate notification not found

    const req = { params: { id: 'notif1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await deleteNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Notification not found'
    });
  });

  // Test for postNotification with success
  test('postNotification should return 201 if notification is successfully created', async () => {
    const newNotification = { notificationid: 'notif1', userid: '1', message: 'New Test Notification', eventid: '123', timestamp: new Date() };
    Notification.prototype.save.mockResolvedValueOnce(newNotification);  // Simulate successful save

    const req = { body: { userid: '1', message: 'New Test Notification', eventid: '123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await postNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Notification created successfully',
      notification: newNotification
    });
  });

  // Test for postNotification with missing fields
  test('postNotification should return 400 if required fields are missing', async () => {
    const req = { body: { message: 'Test message', eventid: '123' } };  // Missing 'userid'
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

  // Test for postNotification with database error
  test('postNotification should handle database errors gracefully', async () => {
    Notification.prototype.save.mockRejectedValueOnce(new Error('Database error')); // Force error

    const req = { body: { userid: '1', message: 'New Test Notification', eventid: '123' } };
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

  // Test for getNotification with database error
  test('getNotification should handle database errors gracefully', async () => {
    Notification.findOne.mockRejectedValueOnce(new Error('Database error')); // Force error

    const req = { params: { id: 'notif1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error fetching notification',
      error: 'Database error'
    });
  });

  // Test for deleteNotification with database error
  test('deleteNotification should handle database errors gracefully', async () => {
    Notification.findOneAndDelete.mockRejectedValueOnce(new Error('Database error')); // Force error

    const req = { params: { id: 'notif1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await deleteNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error deleting notification',
      error: 'Database error'
    });
  });
});
