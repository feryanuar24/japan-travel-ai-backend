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
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    const resetPasswordSecret = process.env.RESET_PASSWORD_SECRET;
    if (!resetPasswordSecret) {
      return res.status(500).json({
        status: false,
        message: "Reset password secret not configured",
        data: null,
      });
    }

    const token = jwt.sign({ id: safeUser._id }, resetPasswordSecret, {
      expiresIn: "1h",
    });

    if (!safeUser.email) {
      return res.status(400).json({
        status: false,
        message: "User email is missing",
        data: null,
      });
    }
    await sendMail({
      to: safeUser.email,
      subject: "Reset your password",
      html: resetPasswordMail(token),
    });

    return res.json({
      status: true,
      message: "Password reset email sent, please check your inbox",
      data: { user: safeUser },
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

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const resetPasswordSecret = process.env.RESET_PASSWORD_SECRET;
    if (!resetPasswordSecret) {
      return res.status(500).json({
        status: false,
        message: "Reset password secret not configured",
        data: null,
      });
    }

    const decoded = jwt.verify(token, resetPasswordSecret);
    if (typeof decoded === "string") {
      return res.status(400).json({
        status: false,
        message: "Invalid token payload",
        data: null,
      });
    }
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    res.json({
      status: true,
      message: "Password reset successfully",
      data: { user: safeUser },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};
