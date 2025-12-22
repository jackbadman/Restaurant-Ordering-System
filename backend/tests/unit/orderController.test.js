import { jest } from "@jest/globals";
import mongoose from "mongoose";
import Category from "../../src/models/Category.js";
import MenuItem from "../../src/models/MenuItem.js";
import Order from "../../src/models/Order.js";
import { createOrder, getOrdersForUser } from "../../src/controllers/orderController.js";

const mockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
});

describe("orderController", () => {
  test("createOrder returns 400 when items missing", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const req = { body: {}, user: { userId } };
    const res = mockRes();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("createOrder persists order with items", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const category = await Category.create({
      name: "Test Category",
      slug: "test-category"
    });
    const menuItem = await MenuItem.create({
      name: "Test Item",
      price: 5,
      categoryId: category._id
    });
    const req = {
      body: {
        items: [{ menuItemId: menuItem._id.toString(), quantity: 1 }]
      },
      user: { userId }
    };
    const res = mockRes();

    await createOrder(req, res);

    const orders = await Order.find();
    expect(orders.length).toBe(1);
  });

  test("getOrdersForUser returns user orders", async () => {
    const userId = new mongoose.Types.ObjectId();
    await Order.create({ userId });

    const req = {
      params: { userId: userId.toString() },
      user: { userId: userId.toString() }
    };
    const res = mockRes();

    await getOrdersForUser(req, res);

    expect(res.json).toHaveBeenCalled();
  });
});
