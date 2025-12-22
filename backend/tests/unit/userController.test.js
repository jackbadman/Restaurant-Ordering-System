import { jest } from "@jest/globals";
import bcrypt from "bcrypt";
import User from "../../src/models/User.js";
import { registerUser, loginUser } from "../../src/controllers/userController.js";

const mockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
});

describe("userController", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "testsecret";
  });

  test("register rejects duplicate email", async () => {
    const passwordHash = await bcrypt.hash("pass123", 10);
    await User.create({
      name: "Test User",
      email: "test@test.com",
      passwordHash
    });

    const req = {
      body: { email: "test@test.com", password: "pass123" }
    };
    const res = mockRes();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("login returns JWT on valid credentials", async () => {
    const passwordHash = await bcrypt.hash("pass123", 10);
    await User.create({
      name: "Login User",
      email: "login@test.com",
      passwordHash
    });

    const req = {
      body: { email: "login@test.com", password: "pass123" }
    };
    const res = mockRes();

    await loginUser(req, res);

    expect(res.json.mock.calls[0][0].token).toBeDefined();
  });
});
