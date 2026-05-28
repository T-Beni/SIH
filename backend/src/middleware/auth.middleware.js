import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyToken(token);

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}