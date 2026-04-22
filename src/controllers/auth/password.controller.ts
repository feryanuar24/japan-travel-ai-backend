import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import { sendMail } from "../../services/mail.service.js";
import { resetPasswordMail } from "../../templates/mail.template.js";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const safeUser = await User.findOne({ email }).select("-password");
    if (!safeUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetPasswordSecret = process.env.RESET_PASSWORD_SECRET;
    if (!resetPasswordSecret) {
      return res
        .status(500)
        .json({ message: "Reset password secret not configured" });
    }

    const token = jwt.sign({ id: safeUser._id }, resetPasswordSecret, {
      expiresIn: "1h",
    });

    if (!safeUser.email) {
      return res.status(400).json({ message: "User email is missing" });
    }
    await sendMail({
      to: safeUser.email,
      subject: "Reset your password",
      html: resetPasswordMail(token),
    });

    res.json({
      message: "Password reset email sent, please check your inbox",
      data: { user: safeUser },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    if (typeof token !== "string") {
      return res.status(400).json({ message: "Token is required" });
    }

    const resetPasswordSecret = process.env.RESET_PASSWORD_SECRET;
    if (!resetPasswordSecret) {
      return res
        .status(500)
        .json({ message: "Reset password secret not configured" });
    }

    const decoded = jwt.verify(token, resetPasswordSecret);
    if (typeof decoded === "string") {
      return res.status(400).json({ message: "Invalid token payload" });
    }
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    res.json({
      message: "Password reset successfully",
      data: { user: safeUser },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
