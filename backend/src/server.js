import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";

import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import menuItemRoutes from "./routes/menuItemRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

app.get("/", (req, res) => res.send("API running..."));

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menuitems", menuItemRoutes);
app.use("/api/orders", orderRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5001;
const server = http.createServer(app);
initSocket(server);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
