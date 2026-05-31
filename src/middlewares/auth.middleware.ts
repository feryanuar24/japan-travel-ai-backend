import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import type { Request, Response, NextFunction } from "express";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((part) => part.trim());

  const tokenCookie = cookies?.find((cookie) => cookie.startsWith("token="));
  if (!tokenCookie) {
    return null;
  }
  const tokenFromCookie = decodeURIComponent(
    tokenCookie?.slice("token=".length) ?? "",
  );

  const authHeader = req.headers.authorization;
  const tokenFromHeader =
    authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const token = tokenFromCookie ?? tokenFromHeader;

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Token missing or malformed",
      data: null,
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        status: false,
        message: "JWT secret not configured",
        data: null,
      });
    }

    const decoded = jwt.verify(token, jwtSecret);
    if (typeof decoded === "string") {
      return res.status(400).json({
        status: false,
        message: "Invalid token payload",
        data: null,
      });
    }
    const userId = decoded.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    req.user = user as typeof req.user;
    next();
  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(401).json({
      status: false,
      message: "Internal server error",
      data: errorMessage,
    });
  }
};

export default auth;
