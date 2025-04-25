const { getAllEventsForUsers, getSelectedEventInfo } = require('../controllers/reportController');
const User = require('../models/userModel');
const EventHistory = require('../models/historyModel');
const Event = require('../models/eventsModel');

jest.mock('../models/userModel');
jest.mock('../models/historyModel');
jest.mock('../models/eventsModel');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('reportController - getAllEventsForUsers', () => {
  it('should return event data for users with history', async () => {
    User.find.mockResolvedValue([{ id: '1', name: 'Alice' }]);
    EventHistory.findOne.mockResolvedValue({
      events: [{ name: 'Cleanup', status: 'Completed' }]
    });

    const req = {};
    const res = mockResponse();

    await getAllEventsForUsers(req, res);

    expect(res.json).toHaveBeenCalledWith([
      {
        userId: '1',
        name: 'Alice',
        events: [{ name: 'Cleanup', status: 'Completed' }]
      }
    ]);
  });

  it('should skip users with no event history', async () => {
    User.find.mockResolvedValue([{ id: '2', name: 'Bob' }]);
    EventHistory.findOne.mockResolvedValue(null);

    const req = {};
    const res = mockResponse();

    await getAllEventsForUsers(req, res);

    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should return an empty array if no users exist', async () => {
    User.find.mockResolvedValue([]);

    const req = {};
    const res = mockResponse();

    await getAllEventsForUsers(req, res);

    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should handle errors and return 500', async () => {
    User.find.mockRejectedValue(new Error('DB error'));

    const req = {};
    const res = mockResponse();

    await getAllEventsForUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

describe('reportController - getSelectedEventInfo', () => {
  it('should return 400 for invalid event ID', async () => {
    const req = { params: { id: '123' } };
    const res = mockResponse();

    await getSelectedEventInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or missing Event ID.' });
  });

  it('should return 404 if event not found', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = mockResponse();

    Event.findById.mockResolvedValue(null);

    await getSelectedEventInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event not found.' });
  });

  it('should return event info when event exists', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = mockResponse();

    Event.findById.mockResolvedValue({
      title: 'Park Cleanup',
      description: 'Clean the park with volunteers',
      volunteersList: [
        { id: '1', name: 'Alice', assignment: 'Trash pickup' },
        { id: '2', name: 'Bob', assignment: 'Recycling' }
      ]
    });

    await getSelectedEventInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      title: 'Park Cleanup',
      description: 'Clean the park with volunteers',
      volunteers: [
        { id: '1', name: 'Alice', assignment: 'Trash pickup' },
        { id: '2', name: 'Bob', assignment: 'Recycling' }
      ]
    });
  });

  it('should return 500 if there is a server error', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = mockResponse();

    Event.findById.mockRejectedValue(new Error('Database failure'));

    await getSelectedEventInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
