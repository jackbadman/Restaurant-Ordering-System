import OrderItem from "../../src/models/OrderItem.js";

describe("OrderItem model", () => {
  test("rejects quantity less than 1", async () => {
    const item = new OrderItem({
      quantity: 0,
      price: 5
    });

    await expect(item.save()).rejects.toThrow();
  });
});