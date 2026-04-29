import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import type { Request, Response, NextFunction } from "express";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }
  const token = authHeader.slice(7);

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }
    
    const decoded = jwt.verify(token, jwtSecret);
    if (typeof decoded === "string") {
      return res.status(400).json({ message: "Invalid token payload" });
    }
    const userId = decoded.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user as typeof req.user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;
