const request = require("supertest");
const express = require("express");
const profileRoutes = require("../routes/profileRoutes");

// 🛠 Mock `fs.promises` BEFORE requiring it
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const fs = require("fs").promises; // Now `fs.promises` will use the mock

const mockUsers = [
  { id: "0", name: "Alice", role: "admin" },
  { id: "1", name: "Bob", role: "user" }
];

// ✅ Set up mocks AFTER defining `mockUsers`
fs.readFile.mockResolvedValue(JSON.stringify(mockUsers));
fs.writeFile.mockResolvedValue();

const app = express();
app.use(express.json());
app.use(profileRoutes);

describe("Profile Routes", () => {
  test("GET /api/profiles should return all users", async () => {
    const res = await request(app).get("/api/profiles");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUsers);
  });

  test("GET /api/profile/:id should return a user", async () => {
    const res = await request(app).get("/api/profile/0");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUsers[0]);
  });

  test("GET /api/profile/:id should return 404 if user not found", async () => {
    const res = await request(app).get("/api/profile/99");
    expect(res.statusCode).toBe(404);
  });

  test("PUT /api/profile/:id should update a user", async () => {
    const updatedData = { name: "Updated Bob", role: "admin" };
    
    const res = await request(app)
      .put("/api/profile/1")
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe("Updated Bob");
    expect(res.body.user.role).toBe("user"); // Role should remain unchanged
  });

  test("PUT /api/profile/:id should return 404 if user not found", async () => {
    const res = await request(app)
      .put("/api/profile/99")
      .send({ name: "Nonexistent" });

    expect(res.statusCode).toBe(404);
  });
});
