import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import type { Request, Response } from "express";

export const verifyEmailController = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    if (typeof token !== "string") {
      return res.status(400).json({ message: "Token is required" });
    }

    const verifyEmailSecret = process.env.VERIFY_EMAIL_SECRET;
    if (!verifyEmailSecret) {
      return res.status(500).json({ message: "Email verification secret not configured" });
    }

    const decoded = jwt.verify(token, verifyEmailSecret);
    if (typeof decoded === "string") {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    const userId = decoded.id;
    const safeUser = await User.findById(userId).select("-password");
    if (!safeUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (safeUser.emailVerifiedAt) {
      return res.status(400).json({ message: "Email already verified" });
    }
    safeUser.emailVerifiedAt = new Date();

    await safeUser.save();

    res.json({
      message: "Email verified successfully",
      data: {
        user: safeUser,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
