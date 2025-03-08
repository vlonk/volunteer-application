const { getAllUsers, getProfile, updateProfile } = require("../controllers/profileController");
const fs = require("fs").promises;

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const mockUsers = [
  { id: "0", name: "Alice", role: "admin" },
  { id: "1", name: "Bob", role: "user" },
];

// Mock `fs.readFile` and `fs.writeFile`
fs.readFile.mockResolvedValue(JSON.stringify(mockUsers));
fs.writeFile.mockResolvedValue();

describe("Profile Controller", () => {
  test("getAllUsers should return all users", async () => {
    const req = {};
    const res = { json: jest.fn() };

    await getAllUsers(req, res);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  test("getProfile should return a single user if ID exists", async () => {
    const req = { params: { id: "0" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await getProfile(req, res);
    expect(res.json).toHaveBeenCalledWith(mockUsers[0]);
  });

  test("getProfile should return 404 if user does not exist", async () => {
    const req = { params: { id: "99" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await getProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  test("updateProfile should update user attributes except 'id' and 'role'", async () => {
    const req = {
      params: { id: "1" },
      body: { name: "Updated Bob", role: "admin", id: "999" },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await updateProfile(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Profile updated successfully",
      user: { id: "1", name: "Updated Bob", role: "user" },
    });
  });

  test("updateProfile should return 404 if user does not exist", async () => {
    const req = { params: { id: "99" }, body: { name: "Nonexistent" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });
});
