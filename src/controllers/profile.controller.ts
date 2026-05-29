import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

type ProfileUser = {
  name?: string | null;
  email?: string | null;
  emailVerifiedAt?: Date | null;
  password?: string | null;
  save: () => Promise<unknown>;
  deleteOne: () => Promise<unknown>;
};

export const indexProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as ProfileUser;

    return res.json({
      status: true,
      message: "Profile retrieved successfully",
      data: {
        user: user,
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

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = req.user as ProfileUser;

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
      user.emailVerifiedAt = null;
    }
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }
    await user.save();

    return res.json({
      status: true,
      message: "Profile updated successfully",
      data: {
        user: user,
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

export const destroyProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as ProfileUser;
    await user.deleteOne();
    return res.json({
      status: true,
      message: "Profile deleted successfully",
      data: {
        user: user,
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
