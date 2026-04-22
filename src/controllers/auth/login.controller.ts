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
      return res.status(404).json({ message: "User not found" });
    }
    const safeUser = await User.findById(user._id).select("-password");

    if (!password || !user.password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.emailVerifiedAt) {
      const verifyEmailSecret = process.env.VERIFY_EMAIL_SECRET;
      if (!verifyEmailSecret) {
        return res.status(500).json({ message: "Email verification secret not configured" });
      }

      const appUrl = process.env.APP_URL;
      if (!appUrl) {
        return res.status(500).json({ message: "App URL not configured" });
      }

      const token = jwt.sign({ id: user._id }, verifyEmailSecret, {
        expiresIn: "1h",
      });
      const url = `${appUrl}/api/auth/verify-email?token=${token}`;

      if(!user.email) {
        return res.status(400).json({ message: "User email is missing" });
      }
      await sendMail({
        to: user.email,
        subject: "Verify your email",
        html: registerMail(url),
      });

      return res.status(400).json({
        message:
          "Email not verified, a new verification email has been sent to your inbox",
        data: {
          user: safeUser,
        },
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      data: {
        user: safeUser,
        token: token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
