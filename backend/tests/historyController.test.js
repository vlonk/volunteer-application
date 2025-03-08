const fs = require("fs").promises;
const path = require("path");
const { getAllEvents, getEvent, updateUserHistory } = require("../controllers/historyController");
const userFilePath = path.join(__dirname, "../data/users.json");
const historyFilePath = path.join(__dirname, "../data/history.json");

// Mock the fs module
jest.mock("fs", () => ({
    promises: {
        readFile: jest.fn(),
        writeFile: jest.fn(),
    }
}));

describe("HistoryController", () => {
    describe("getAllEvents", () => {
        it("should return user history successfully", async () => {
            // Mocking the users.json and history.json data
            const mockUsers = { "1": { eventhistoryId: "history_1" } };
            const mockHistory = { "history_1": [{ eventId: "event_1", eventName: "Test Event" }] };
            
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockUsers)); // Mock getUsers
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockHistory)); // Mock getHistory
            
            const req = { params: { userId: "1" } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            
            await getAllEvents(req, res);
            
            expect(res.json).toHaveBeenCalledWith(mockHistory.history_1);
            expect(res.status).not.toHaveBeenCalledWith(404);
        });

        it("should return 404 if user is not found", async () => {
            const mockUsers = {};
            const mockHistory = { "history_1": [] };
            
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockUsers)); // Mock getUsers
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockHistory)); // Mock getHistory
            
            const req = { params: { userId: "99" } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            
            await getAllEvents(req, res);
            
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });

        it("should return 404 if user history is not found", async () => {
            const mockUsers = { "1": { eventhistoryId: "history_2" } };
            const mockHistory = { "history_1": [] };
            
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockUsers)); // Mock getUsers
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockHistory)); // Mock getHistory
            
            const req = { params: { userId: "1" } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            
            await getAllEvents(req, res);
            
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User history not found" });
        });

        it("should return 500 if there is an error fetching user events", async () => {
            fs.readFile.mockRejectedValueOnce(new Error("File read error"));
            
            const req = { params: { userId: "1" } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            
            await getAllEvents(req, res);
            
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error fetching user events", error: expect.any(Error) });
        });
    });

    describe("getEvent", () => {
        it("should return a specific event for a user", async () => {
            const mockUsers = { "1": { eventhistoryId: "history_1" } };
            const mockHistory = { "history_1": [{ eventId: "event_1", eventName: "Test Event" }] };
            
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockUsers)); // Mock getUsers
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockHistory)); // Mock getHistory
            
            const req = { params: { userId: "1", eventId: "event_1" } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            
            await getEvent(req, res);
            
            expect(res.json).toHaveBeenCalledWith(mockHistory.history_1[0]);
        });

        it("should return 404 if event is not found", async () => {
            const mockUsers = { "1": { eventhistoryId: "history_1" } };
            const mockHistory = { "history_1": [{ eventId: "event_1", eventName: "Test Event" }] };
            
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockUsers)); // Mock getUsers
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockHistory)); // Mock getHistory
            
            const req = { params: { userId: "1", eventId: "event_2" } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            
            await getEvent(req, res);
            
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Event not found" });
        });

        it("should return 404 if user is not found", async () => {
            const mockUsers = {};
            const mockHistory = { "history_1": [] };
            
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockUsers)); // Mock getUsers
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockHistory)); // Mock getHistory
            
            const req = { params: { userId: "99", eventId: "event_1" } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            
            await getEvent(req, res);
            
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });

    describe("updateUserHistory", () => {
        it("should update user history successfully", async () => {
            const mockUsers = { "1": { eventhistoryId: "history_1" } };
            const mockHistory = { "history_1": [{ eventId: "event_1", eventName: "Test Event" }] };
            const updatedHistory = [{ eventId: "event_2", eventName: "New Event" }];
            
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockUsers)); // Mock getUsers
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockHistory)); // Mock getHistory
            fs.writeFile.mockResolvedValueOnce(); // Mock writeFile
            
            const req = { params: { userId: "1" }, body: updatedHistory };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            
            await updateUserHistory(req, res);
            
            expect(res.json).toHaveBeenCalledWith({ message: "User history updated successfully", updatedHistory });
        });

        it("should return 404 if user history is not found", async () => {
            const mockUsers = { "1": { eventhistoryId: "history_2" } };
            const mockHistory = { "history_1": [] };
            
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockUsers)); // Mock getUsers
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockHistory)); // Mock getHistory
            
            const req = { params: { userId: "1" }, body: [{ eventId: "event_2", eventName: "New Event" }] };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            
            await updateUserHistory(req, res);
            
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User history not found" });
        });

        it("should return 500 if there is an error updating user history", async () => {
            const mockUsers = { "1": { eventhistoryId: "history_1" } };
            const mockHistory = { "history_1": [{ eventId: "event_1", eventName: "Test Event" }] };
            
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockUsers)); // Mock getUsers
            fs.readFile.mockResolvedValueOnce(JSON.stringify(mockHistory)); // Mock getHistory
            fs.writeFile.mockRejectedValueOnce(new Error("Write error")); // Mock writeFile error
            
            const req = { params: { userId: "1" }, body: [{ eventId: "event_2", eventName: "New Event" }] };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            
            await updateUserHistory(req, res);
            
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error updating user history", error: expect.any(Error) });
        });
    });
});
