const request = require('supertest');
const app = require('../app'); // Import your Express app
const Notification = require('../models/notificationModel');

// Mock Mongoose model
jest.mock('../models/notificationModel');

describe('Notification Controller', () => {
  describe('GET /notifications/:userId', () => {
    it('should return all notifications for a user', async () => {
      const mockNotifications = [
        { notificationId: 1, userId: '1', message: 'Test 1', status: 'Unread' },
        { notificationId: 2, userId: '1', message: 'Test 2', status: 'Read' }
      ];

      Notification.find.mockResolvedValue(mockNotifications);

      const response = await request(app).get('/notifications/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockNotifications);
    });

    it('should return 404 if no notifications are found', async () => {
      Notification.find.mockResolvedValue([]);

      const response = await request(app).get('/notifications/1');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No notifications found for this user');
    });

    it('should return 500 if there is an error fetching notifications', async () => {
      Notification.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/notifications/1');
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error fetching notifications');
    });
  });

  describe('GET /notifications/notification/:id', () => {
    it('should return a notification by its ID', async () => {
      const mockNotification = { notificationId: 1, userId: '1', message: 'Test', status: 'Unread' };

      Notification.findOne.mockResolvedValue(mockNotification);

      const response = await request(app).get('/notifications/notification/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockNotification);
    });

    it('should return 404 if the notification is not found', async () => {
      Notification.findOne.mockResolvedValue(null);

      const response = await request(app).get('/notifications/notification/999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Notification not found');
    });

    it('should return 500 if there is an error fetching the notification', async () => {
      Notification.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/notifications/notification/1');
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error fetching notification');
    });
  });

  describe('DELETE /notifications/:id', () => {
    it('should delete a notification by its ID', async () => {
      Notification.findOneAndDelete.mockResolvedValue({ notificationId: 1 });

      const response = await request(app).delete('/notifications/1');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Notification deleted successfully');
    });

    it('should return 404 if the notification to delete is not found', async () => {
      Notification.findOneAndDelete.mockResolvedValue(null);

      const response = await request(app).delete('/notifications/999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Notification not found');
    });

    it('should return 500 if there is an error deleting the notification', async () => {
      Notification.findOneAndDelete.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/notifications/1');
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error deleting notification');
    });
  });
});
