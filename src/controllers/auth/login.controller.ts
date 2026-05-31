import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import type { Request, Response } from "express";
import { sendMail } from "../../services/mail.service.js";
import { registerMail } from "../../templates/mail.template.js";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }
    const safeUser = await User.findById(user._id).select("-password");

    if (!password || !user.password) {
      return res.status(400).json({
        status: false,
        message: "Password is required",
        data: null,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    if (!user.emailVerifiedAt) {
      const verifyEmailSecret = process.env.VERIFY_EMAIL_SECRET;
      if (!verifyEmailSecret) {
        return res.status(500).json({
          status: false,
          message: "Email verification secret not configured",
          data: null,
        });
      }

      const appUrl = process.env.APP_URL;
      if (!appUrl) {
        return res.status(500).json({
          status: false,
          message: "App URL not configured",
          data: null,
        });
      }

      const token = jwt.sign({ id: user._id }, verifyEmailSecret, {
        expiresIn: "1h",
      });
      const url = `${appUrl}/api/auth/verify-email?token=${token}`;

      if (!user.email) {
        return res.status(400).json({
          status: false,
          message: "User email is missing",
          data: null,
        });
      }
      await sendMail({
        to: user.email,
        subject: "Verify your email",
        html: registerMail(url),
      });

      return res.status(400).json({
        status: false,
        message:
          "Email not verified, a new verification email has been sent to your inbox",
        data: {
          user: safeUser,
        },
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        status: false,
        message: "JWT secret not configured",
        data: null,
      });
    }
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "7d" });
    const isProduction = process.env.APP_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      status: true,
      message: "Login successful",
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
