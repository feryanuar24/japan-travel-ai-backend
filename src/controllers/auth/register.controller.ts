import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import { sendMail } from "../../services/mail.service.js";
import { registerMail } from "../../templates/mail.template.js";
import type { Request, Response } from "express";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const verifyEmailSecret = process.env.VERIFY_EMAIL_SECRET;
    if (!verifyEmailSecret) {
      return res
        .status(500)
        .json({ message: "Verify email secret not configured" });
    }

    const appUrl = process.env.APP_URL;
    if (!appUrl) {
      return res.status(500).json({ message: "App URL not configured" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const createdUser = await User.create({
      name,
      email,
      role: "user",
      emailVerifiedAt: null,
      password: hashed,
    });

    const token = jwt.sign({ id: createdUser._id }, verifyEmailSecret, {
      expiresIn: "1h",
    });
    const url = `${appUrl}/api/auth/verify-email?token=${token}`;

    await sendMail({
      to: createdUser.email as string,
      subject: "Verify your email",
      html: registerMail(url),
    });

    const safeUser = await User.findById(createdUser._id).select("-password");

    res.json({
      message:
        "Registration successful, please check your email to verify your account",
      data: { user: safeUser },
    });
  } catch (err) {
    console.error(err); 
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
