import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    return typeof next === "function"
      ? next()
      : res.status(500).json({ message: "Routing error: next not provided" });
  });
};
