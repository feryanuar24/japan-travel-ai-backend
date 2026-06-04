import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import type { Request, Response } from "express";

export const verifyEmailController = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    if (typeof token !== "string") {
      return res.status(400).json({
        status: false,
        message: "Token is required",
        data: null,
      });
    }

    const verifyEmailSecret = process.env.VERIFY_EMAIL_SECRET;
    if (!verifyEmailSecret) {
      return res.status(500).json({
        status: false,
        message: "Email verification secret not configured",
        data: null,
      });
    }

    const decoded = jwt.verify(token, verifyEmailSecret);
    if (typeof decoded === "string") {
      return res.status(400).json({
        status: false,
        message: "Invalid token payload",
        data: null,
      });
    }

    const userId = decoded.id;
    const safeUser = await User.findById(userId).select("-password");
    if (!safeUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    if (safeUser.emailVerifiedAt) {
      return res.status(400).json({
        status: false,
        message: "Email already verified",
        data: null,
      });
    }
    safeUser.emailVerifiedAt = new Date();

    await safeUser.save();

    return res.render("verify-email", {
      status: true,
      message: "Email verified successfully",
      data: {
        user: safeUser,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
