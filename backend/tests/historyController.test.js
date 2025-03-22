const { getAllEvents, getEvent, updateUserHistory } = require("../controllers/historyController");
const User = require("../models/userModel");
const EventHistory = require("../models/historyModel");

jest.mock("../models/userModel");
jest.mock("../models/historyModel");

describe("Event Controller Tests", () => {
    let req, res;

    beforeEach(() => {
        req = { params: {}, body: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe("getAllEvents", () => {
        it("should return all events for a valid user", async () => {
            req.params.userId = "123";

            const mockUser = { id: "123", eventhistoryId: "456" };
            const mockHistory = { id: "456", events: [{ eventId: "1", name: "Test Event" }] };

            User.findOne.mockResolvedValue(mockUser);
            EventHistory.findOne.mockResolvedValue(mockHistory);

            await getAllEvents(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ id: "123" });
            expect(EventHistory.findOne).toHaveBeenCalledWith({ id: "456" });
            expect(res.json).toHaveBeenCalledWith(mockHistory.events);
        });

        it("should return 404 if user is not found", async () => {
            req.params.userId = "123";
            User.findOne.mockResolvedValue(null);

            await getAllEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });

        it("should return 404 if user history is not found", async () => {
            req.params.userId = "123";
            User.findOne.mockResolvedValue({ id: "123", eventhistoryId: "456" });
            EventHistory.findOne.mockResolvedValue(null);

            await getAllEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User history not found" });
        });

        it("should return 500 on error", async () => {
            req.params.userId = "123";
            User.findOne.mockRejectedValue(new Error("Database error"));

            await getAllEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error fetching user events" }));
        });
    });

    describe("getEvent", () => {
        it("should return the requested event", async () => {
            req.params = { userId: "123", eventId: "1" };

            const mockUser = { id: "123", eventhistoryId: "456" };
            const mockHistory = { id: "456", events: [{ eventId: "1", name: "Test Event" }] };

            User.findOne.mockResolvedValue(mockUser);
            EventHistory.findOne.mockResolvedValue(mockHistory);

            await getEvent(req, res);

            expect(res.json).toHaveBeenCalledWith(mockHistory.events[0]);
        });

        it("should return 404 if event is not found", async () => {
            req.params = { userId: "123", eventId: "99" };

            User.findOne.mockResolvedValue({ id: "123", eventhistoryId: "456" });
            EventHistory.findOne.mockResolvedValue({ id: "456", events: [{ eventId: "1", name: "Test Event" }] });

            await getEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Event not found" });
        });

        it("should return 500 on error", async () => {
            req.params = { userId: "123", eventId: "1" };
            User.findOne.mockRejectedValue(new Error("Database error"));

            await getEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error fetching event" }));
        });
    });

    describe("updateUserHistory", () => {
        it("should add an event to user history", async () => {
            req.params.userId = "123";
            req.body = [{ eventId: "2", name: "New Event" }];

            const mockUser = { id: "123", eventhistoryId: "456" };
            const mockHistory = { id: "456", events: [{ eventId: "1", name: "Test Event" }], save: jest.fn() };

            User.findOne.mockResolvedValue(mockUser);
            EventHistory.findOne.mockResolvedValue(mockHistory);

            await updateUserHistory(req, res);

            expect(mockHistory.events).toContainEqual(req.body[0]);
            expect(mockHistory.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ message: "User history updated successfully", updatedHistory: req.body });
        });

        it("should return 404 if user is not found", async () => {
            req.params.userId = "123";
            User.findOne.mockResolvedValue(null);

            await updateUserHistory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });

        it("should return 500 on error", async () => {
            req.params.userId = "123";
            req.body = [{ eventId: "2", name: "New Event" }];
            User.findOne.mockRejectedValue(new Error("Database error"));

            await updateUserHistory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error updating user history" }));
        });
    });
});
