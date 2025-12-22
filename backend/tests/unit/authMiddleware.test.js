import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import { requireAuth } from "../../src/middleware/authMiddleware.js";

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("requireAuth", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "testsecret";
  });

  test("returns 401 when token is missing", () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("attaches user when token is valid", () => {
    const token = jwt.sign({ userId: "123" }, "testsecret");

    const req = {
      headers: { authorization: `Bearer ${token}` }
    };
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(req.user.userId).toBe("123");
    expect(next).toHaveBeenCalled();
  });
});
