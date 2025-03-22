const { getAllEvents, createEvent, getMatchingEvents, updateEvent, deleteEvent } = require('../controllers/eventsController');
const Event = require('../models/eventsModel'); // Import Mongoose model
const User = require('../models/userModel'); // Import User model

jest.mock('../models/eventsModel'); // Mock Event model
jest.mock('../models/userModel'); // Mock User model

describe('Event Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset all mocks before each test
  });

  test('getAllEvents should return all events', async () => {
    const mockEvents = [
      { id: 1, name: "Event 1", skills: ["JavaScript"] },
      { id: 2, name: "Event 2", skills: ["Node.js"] }
    ];

    Event.find.mockResolvedValue(mockEvents); // Mock Mongoose query

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getAllEvents(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEvents);
  });

  test('getAllEvents should return 404 when no events are available', async () => {
    // Simulate that no events are found in the database
    Event.find.mockResolvedValue([]);  // Mock Event.find to return an empty array

    const req = {};  // Empty request object as we don't need params or body
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()  // Mock status method
    };

    // Call the controller function
    await getAllEvents(req, res);

    // Assert that 404 is returned with the correct message
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No events found' });
});

test('getAllEvents should return 404 when Event.find() returns null', async () => {
  // Simulate that Event.find returns null
  Event.find.mockResolvedValue(null);  // Mock Event.find to return null

  const req = {};  // Empty request object
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()  // Mock status method
  };

  // Call the controller function
  await getAllEvents(req, res);

  // Assert that 404 is returned with the correct message
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: 'No events found' });
});

test('getAllEvents should return 500 when Event.find() throws an error', async () => {
  // Simulate an error thrown by Event.find()
  Event.find.mockRejectedValue(new Error('Database error'));

  const req = {};  // Empty request object
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()  // Mock status method
  };

  // Call the controller function
  await getAllEvents(req, res);

  // Assert that 500 is returned with the error message
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Error fetching events',
    error: 'Database error'
  });
});


  test('createEvent should create a new event', async () => {
    const newEvent = { name: "New Event", skills: ["React"] };
    const savedEvent = { _id: "123", ...newEvent };

    Event.prototype.save = jest.fn().mockResolvedValue(savedEvent); // Mock save method

    const req = { body: newEvent };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await createEvent(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Event created successfully',
      event: newEvent
    });
  });

  test('getMatchingEvents should return matching events based on skills', async () => {
    const mockUser = { id: "1", skills: ["JavaScript"] };
    const mockEvents = [
      { id: 1, name: "Event 1", selectedSkills: ["JavaScript", "Node.js"] },
      { id: 2, name: "Event 2", selectedSkills: ["React"] }
    ];

    User.findOne.mockResolvedValue(mockUser);
    Event.find.mockResolvedValue(mockEvents); // Mock DB query

    const req = { params: { id: "1" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getMatchingEvents(req, res);
    expect(res.json).toHaveBeenCalledWith([mockEvents[0]]);
  });

  test('getMatchingEvents should return 404 when no matching events are found', async () => {
    const mockUser = { id: "1", skills: ["JavaScript"] };
    const mockEvents = [
      { id: 1, name: "Event 1", selectedSkills: ["Python", "Ruby"] },
      { id: 2, name: "Event 2", selectedSkills: ["C++"] }
    ];

    User.findOne.mockResolvedValue(mockUser);
    Event.find.mockResolvedValue(mockEvents); // Mock DB query

    const req = { params: { id: "1" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getMatchingEvents(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No matching events found' });
});

test('getMatchingEvents should handle null or undefined selectedSkills gracefully', async () => {
  const mockUser = { id: "1", skills: ["JavaScript"] };
  const mockEvents = [
    { id: 1, name: "Event 1", selectedSkills: null },  // Null selectedSkills
    { id: 2, name: "Event 2", selectedSkills: undefined }  // Undefined selectedSkills
  ];

  User.findOne.mockResolvedValue(mockUser);
  Event.find.mockResolvedValue(mockEvents); // Mock DB query

  const req = { params: { id: "1" } };
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  await getMatchingEvents(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: 'No matching events found' });
});

test('getMatchingEvents should return 404 when no events are available', async () => {
  const mockUser = { id: "1", skills: ["JavaScript"] };
  const mockEvents = [];

  User.findOne.mockResolvedValue(mockUser);
  Event.find.mockResolvedValue(mockEvents); // Mock DB query

  const req = { params: { id: "1" } };
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  await getMatchingEvents(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: 'No events available' });
});

test('getMatchingEvents should return 404 when user is not found', async () => {
  // Mock User.findOne to return null (simulate that the user is not found)
  User.findOne.mockResolvedValue(null);

  const req = { params: { id: "1" } };  // Mock request with the user ID
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()  // Mock status method
  };

  // Call the controller function
  await getMatchingEvents(req, res);

  // Assert that 404 is returned with the correct message
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    message: 'User not found'
  });
});

test('getMatchingEvents should return 500 if user skills are not in the expected array format', async () => {
  // Mock a user with skills that is not an array (e.g., a string or an object)
  const mockUser = { id: "1", skills: "JavaScript" };  // skills should be an array, but it's a string
  
  // Mock User.findOne to return the mock user
  User.findOne.mockResolvedValue(mockUser);

  const req = { params: { id: "1" } };  // Mock request with the user ID
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()  // Mock status method
  };

  // Call the controller function
  await getMatchingEvents(req, res);

  // Assert that 500 is returned with the correct message
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: 'User skills are not in the expected array format'
  });
});

test('getMatchingEvents should return matching events based on skills', async () => {
  // Mock user with skills that match some events
  const mockUser = { id: "1", skills: ["JavaScript"] };

  // Mock events where one matches the user's skills
  const mockEvents = [
    { id: 1, name: "Event 1", selectedSkills: ["JavaScript", "Node.js"] },
    { id: 2, name: "Event 2", selectedSkills: ["React"] }
  ];

  // Mock the User.findOne to return the mock user
  User.findOne.mockResolvedValue(mockUser);

  // Mock the getEvents function to return the mock events
  Event.find.mockResolvedValue(mockEvents);

  const req = { params: { id: "1" } };  // Mock request with user ID
  const res = {
    json: jest.fn(),   // Mock json response method
    status: jest.fn().mockReturnThis()  // Mock status method
  };

  // Call the controller function
  await getMatchingEvents(req, res);

  // Assert that the response JSON includes the correct matching event
  expect(res.json).toHaveBeenCalledWith([mockEvents[0]]);  // The first event matches the user's skill
});


  test('updateEvent should update an existing event', async () => {
    const existingEvent = { _id: "1", name: "Old Event", skills: ["JavaScript"] };
    const updatedEvent = { name: "Updated Event" };
  
    // Mock the findByIdAndUpdate method to return the updated event
    Event.findByIdAndUpdate.mockResolvedValue({
      ...existingEvent,
      ...updatedEvent
    });
  
    // Prepare request and response objects
    const req = { params: { id: "1" }, body: updatedEvent };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  
    // Call the updateEvent function
    await updateEvent(req, res);
  
    // Assert the correct response was sent
    expect(res.json).toHaveBeenCalledWith({
      message: 'Event updated successfully',
      event: { _id: "1", name: "Updated Event", skills: ["JavaScript"] }
    });
  });
  
  test('updateEvent should return 404 if event is not found', async () => {
    // Mocking Event.findByIdAndUpdate to return null, indicating that the event was not found
    Event.findByIdAndUpdate.mockResolvedValue(null);

    const req = { params: { id: "1" }, body: { name: "Updated Event" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // Call the updateEvent function
    await updateEvent(req, res);

    // Assert that res.status(404) was called with the correct error message
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Event not found" });
});

test('updateEvent should return 500 if an error occurs during the update', async () => {
  // Mocking Event.findByIdAndUpdate to throw an error, simulating a failure during the update
  const errorMessage = "Database error";
  Event.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

  const req = { params: { id: "1" }, body: { name: "Updated Event" } };
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  // Call the updateEvent function
  await updateEvent(req, res);

  // Assert that res.status(500) was called with the correct error message
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ message: "Error updating event", error: errorMessage });
});


  test('deleteEvent should delete an existing event', async () => {
    const mockEvent = { _id: "1", name: "Event to Delete" };

    Event.findByIdAndDelete.mockResolvedValue(mockEvent);

    const req = { params: { id: "1" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await deleteEvent(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Event deleted successfully'
    });
  });

  test('deleteEvent should return 404 if the event is not found', async () => {
    // Mocking Event.findByIdAndDelete to return null, simulating the case where the event is not found
    Event.findByIdAndDelete.mockResolvedValue(null); // Event is not found

    const req = { params: { id: "1" } }; // ID of the event to delete
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // Call the deleteEvent function
    await deleteEvent(req, res);

    // Assert that res.status(404) was called with the correct error message
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Event not found." });
});

test('deleteEvent should return 500 if an error occurs during deletion', async () => {
  // Mocking Event.findByIdAndDelete to throw an error, simulating a failure during deletion
  Event.findByIdAndDelete.mockRejectedValue(new Error("Database error")); // Simulate a DB error

  const req = { params: { id: "1" } }; // ID of the event to delete
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  // Call the deleteEvent function
  await deleteEvent(req, res);

  // Assert that res.status(500) was called with the correct error message
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: "Error deleting event",
    error: expect.anything() // Expect any error object
  });
});


  test('createEvent should handle errors gracefully', async () => {
    Event.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));

    const req = { body: { name: "Faulty Event" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await createEvent(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error creating event',
      error: expect.anything()
    });
  });
});
