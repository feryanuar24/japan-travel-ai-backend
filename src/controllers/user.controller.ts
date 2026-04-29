import type { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const indexUser = async (req: Request, res: Response) => {
  try {
    const safeUsers = await User.find().select("-password");

    res.json({
      message: "Users retrieved successfully",
      data: { users: safeUsers },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const storeUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      role,
      password: hashed,
      emailVerifiedAt: new Date(),
    });

    const safeUser = await User.findById(user._id).select("-password");

    res.status(201).json({
      message: "User created successfully",
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

export const showUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const safeUser = await User.findById(id).select("-password");
    if (!safeUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User retrieved successfully",
      data: { user: safeUser },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const updateData: {
      name?: string;
      email?: string;
      role?: string;
      password?: string;
    } = {
      name,
      email,
      role,
    };

    if (password) {
      const hashed = await bcrypt.hash(password, 12);
      updateData.password = hashed;
    }

    const safeUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");
    if (!safeUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      data: { user: safeUser },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const destroyUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const safeUser = await User.findByIdAndDelete(id).select("-password");
    if (!safeUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      data: { user: safeUser },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
