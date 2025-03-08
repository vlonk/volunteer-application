const { getAllEvents, createEvent, getMatchingEvents, updateEvent, deleteEvent } = require('../controllers/eventsController');
const fs = require('fs').promises;

// Mock fs.promises directly
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

describe('Event Controller Tests', () => {
  beforeEach(() => {
    // Reset fs mock data before each test
    fs.readFile.mockReset();
    fs.writeFile.mockReset();
  });

  test('getAllEvents should return all events', async () => {
    const mockEvents = { 
      1: { id: 1, name: "Event 1", skills: ["JavaScript"] },
      2: { id: 2, name: "Event 2", skills: ["Node.js"] }
    };
    fs.readFile.mockResolvedValueOnce(JSON.stringify(mockEvents));

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getAllEvents(req, res);
    expect(res.json).toHaveBeenCalledWith(mockEvents);
  });

  test('createEvent should create a new event', async () => {
    const newEvent = { name: "New Event", skills: ["React"] };
    const mockEvents = {
      1: { id: 1, name: "Event 1", skills: ["JavaScript"] }
    };

    fs.readFile.mockResolvedValueOnce(JSON.stringify(mockEvents));

    const req = { body: newEvent };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await createEvent(req, res);
    expect(fs.writeFile).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('New Event'));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Event created successfully',
      event: { id: 2, ...newEvent }
    });
  });

  test('getMatchingEvents should return matching events based on skills', async () => {
    const mockEvents = {
      1: { id: 1, name: "Event 1", skills: ["JavaScript", "Node.js"] },
      2: { id: 2, name: "Event 2", skills: ["React"] }
    };
    fs.readFile.mockResolvedValueOnce(JSON.stringify(mockEvents));

    const req = { body: { skills: "JavaScript" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getMatchingEvents(req, res);
    expect(res.json).toHaveBeenCalledWith([mockEvents[1]]);
  });

  test('updateEvent should update an existing event', async () => {
    const mockEvents = {
      1: { id: 1, name: "Event 1", skills: ["JavaScript"] }
    };
    fs.readFile.mockResolvedValueOnce(JSON.stringify(mockEvents));

    const updatedEvent = { name: "Updated Event" };
    const req = { params: { id: 1 }, body: updatedEvent };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await updateEvent(req, res);
    expect(fs.writeFile).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: 'Event updated successfully',
      event: { id: 1, name: "Updated Event", skills: ["JavaScript"] }
    });
  });

  test('deleteEvent should delete an existing event', async () => {
    const mockEvents = {
      1: { id: 1, name: "Event 1", skills: ["JavaScript"] }
    };
    fs.readFile.mockResolvedValueOnce(JSON.stringify(mockEvents));

    const req = { params: { id: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await deleteEvent(req, res);
    expect(fs.writeFile).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: 'Event deleted successfully'
    });
  });

  test('createEvent should handle errors gracefully', async () => {
    fs.readFile.mockRejectedValueOnce(new Error("Error reading events"));

    const req = { body: { name: "Faulty Event" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await createEvent(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error creating event',
      error: expect.any(Error)
    });
  });
});
