const fs = require('fs').promises;
const { getAllNotifications, getNotification, deleteNotification } = require('../controllers/notificationController');

// Mocking fs
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
        writeFile: jest.fn()
    }
}));

describe('Notification Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('getAllNotifications', () => {
        it('should return all notifications for a user', async () => {
            // Mock the data to be returned by readFile
            fs.readFile.mockResolvedValueOnce(JSON.stringify({
                notifications: [
                    { userId: '1', notificationId: 1, message: 'Test' },
                    { userId: '2', notificationId: 2, message: 'Test 2' }
                ]
            }));

            req.params.userId = '1'; // Simulate the userId in the request params

            await getAllNotifications(req, res);

            expect(res.json).toHaveBeenCalledWith([
                { userId: '1', notificationId: 1, message: 'Test' }
            ]);
        });

        it('should return a 404 if no notifications found for the user', async () => {
            fs.readFile.mockResolvedValueOnce(JSON.stringify({ notifications: [] }));

            req.params.userId = '999'; // Simulate a userId that has no notifications

            await getAllNotifications(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "No notifications found for this user" });
        });

        it('should return a 500 if there is an error fetching notifications', async () => {
            fs.readFile.mockRejectedValueOnce(new Error('File read error'));

            await getAllNotifications(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error fetching notifications", error: expect.any(Error) });
        });
    });

    describe('getNotification', () => {
        it('should return a notification by its ID', async () => {
            const mockNotifications = [
                { userId: '1', notificationId: 1, message: 'Test' },
                { userId: '1', notificationId: 2, message: 'Test 2' }
            ];
            fs.readFile.mockResolvedValueOnce(JSON.stringify({ notifications: mockNotifications }));

            req.params.id = '1'; // Simulate notificationId in the request params

            await getNotification(req, res);

            expect(res.json).toHaveBeenCalledWith({ userId: '1', notificationId: 1, message: 'Test' });
        });

        it('should return 404 if the notification is not found', async () => {
            fs.readFile.mockResolvedValueOnce(JSON.stringify({ notifications: [] }));

            req.params.id = '999'; // Non-existing notificationId

            await getNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Notification not found' });
        });

        it('should return 500 if there is an error reading notification data', async () => {
            fs.readFile.mockRejectedValueOnce(new Error('File read error'));

            req.params.id = '1'; // Simulate notificationId in the request params

            await getNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error reading notification data", error: expect.any(Error) });
        });

        it('should return 400 if the notification ID is invalid', async () => {
            req.params.id = 'invalid-id'; // Invalid ID format

            await getNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid notification ID format' });
        });
    });

    describe('deleteNotification', () => {
        it('should delete a notification by its ID', async () => {
            const mockNotifications = [
                { userId: '1', notificationId: 1, message: 'Test' },
                { userId: '1', notificationId: 2, message: 'Test 2' }
            ];
            fs.readFile.mockResolvedValueOnce(JSON.stringify({ notifications: mockNotifications }));
            fs.writeFile.mockResolvedValueOnce(); // Mock successful file write

            req.params.id = '1'; // Simulate notificationId in the request params

            await deleteNotification(req, res);

            expect(fs.writeFile).toHaveBeenCalledWith(expect.any(String), JSON.stringify([{ userId: '1', notificationId: 2, message: 'Test 2' }]), expect.any(Function)); // After deletion, only the second notification remains
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Notification deleted successfully' });
        });

        it('should return 404 if notification to delete is not found', async () => {
            fs.readFile.mockResolvedValueOnce(JSON.stringify({ notifications: [] })); // No notifications in the data

            req.params.id = '999'; // Non-existing notificationId

            await deleteNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Notification not found" });
        });

        it('should return 500 if there is an error deleting the notification', async () => {
            fs.readFile.mockResolvedValueOnce(JSON.stringify([{ userId: '1', notificationId: 1, message: 'Test' }]));
            fs.writeFile.mockRejectedValueOnce(new Error('File write error')); // Simulate file write error

            req.params.id = '1';

            await deleteNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error deleting notification", error: expect.any(Error) });
        });

        it('should return 400 if the notification ID is invalid', async () => {
            req.params.id = 'invalid-id'; // Invalid ID format

            await deleteNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid notification ID format' });
        });
    });
});
