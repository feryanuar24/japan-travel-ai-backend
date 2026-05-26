import type { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const indexUser = async (req: Request, res: Response) => {
  try {
    const safeUsers = await User.find().select("-password");

    return res.json({
      status: true,
      message: "Users retrieved successfully",
      data: { users: safeUsers },
    });
  } catch (err) {
    console.error(err);
    const errMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: errMessage,
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

    return res.status(201).json({
      status: true,
      message: "User created successfully",
      data: {
        user: safeUser,
      },
    });
  } catch (err) {
    console.error(err);
    const errMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: errMessage,
    });
  }
};

export const showUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const safeUser = await User.findById(id).select("-password");
    if (!safeUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    return res.json({
      status: true,
      message: "User retrieved successfully",
      data: { user: safeUser },
    });
  } catch (err) {
    console.error(err);
    const errMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: errMessage,
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
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    return res.json({
      status: true,
      message: "User updated successfully",
      data: { user: safeUser },
    });
  } catch (err) {
    console.error(err);
    const errMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: errMessage,
    });
  }
};

export const destroyUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const safeUser = await User.findByIdAndDelete(id).select("-password");
    if (!safeUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    return res.json({
      status: true,
      message: "User deleted successfully",
      data: { user: safeUser },
    });
  } catch (err) {
    console.error(err);
    const errMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: errMessage,
    });
  }
};
