import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (typeof user.password !== "string") {
      return res.status(500).json({ message: "User password is invalid" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message });
  }
};
