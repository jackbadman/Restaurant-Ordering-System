import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import orderRoutes from "../../src/routes/orderRoutes.js";
import Category from "../../src/models/Category.js";
import MenuItem from "../../src/models/MenuItem.js";
import Order from "../../src/models/Order.js";
import OrderItem from "../../src/models/OrderItem.js";
import User from "../../src/models/User.js";

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/orders", orderRoutes);
  return app;
};

describe("Orders API integration tests", () => {
  const app = buildApp();
  let token;
  let userId;

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
    process.env.JWT_SECRET = "testsecret";
    const passwordHash = await bcrypt.hash("password123", 10);

    const user = await User.create({
      name: "Integration User",
      email: "integration@test.com",
      passwordHash
    });

    userId = user._id.toString();
    token = jwt.sign({ userId }, process.env.JWT_SECRET);
  });

  test("POST /api/orders creates an order for authenticated user", async () => {
    const menuItemId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [
          { menuItemId, quantity: 1, price: 5 }
        ]
      });

    expect(res.statusCode).toBe(200);

    const orders = await Order.find();
    const orderItems = await OrderItem.find();
    expect(orders.length).toBe(1);
    expect(orderItems.length).toBe(1);
    expect(orders[0].userId.toString()).toBe(userId);
  });

  test("GET /api/orders/user/:userId returns orders for that user", async () => {
    const category = await Category.create({
      name: "Starters",
      slug: "starters"
    });
    const menuItem = await MenuItem.create({
      name: "Test Item",
      description: "Test description",
      price: 5,
      categoryId: category._id
    });
    const order = await Order.create({
      userId
    });
    await OrderItem.create({
      orderId: order._id,
      menuItemId: menuItem._id,
      quantity: 1,
      price: 5
    });

    const res = await request(app)
      .get(`/api/orders/user/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.orders.length).toBe(1);
    expect(res.body.orders[0].items.length).toBe(1);
  });

  test("GET /api/orders/user/:userId returns orders for that user without items", async () => {
    await Order.create({
      userId
    });

    const res = await request(app)
      .get(`/api/orders/user/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.orders.length).toBe(1);
    expect(res.body.orders[0].items.length).toBe(0);
  });

  test("Unauthenticated request is rejected", async () => {
    const res = await request(app)
      .get(`/api/orders/user/${userId}`);

    expect(res.statusCode).toBe(401);
  });
});
