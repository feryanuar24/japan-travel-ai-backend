import type { Request, Response } from "express";

export const meController = async (req: Request, res: Response) => {
  const user = req.user ?? null;

  return res.json({
    status: true,
    message: "User retrieved",
    data: {
      user: user,
    },
  });
};

export default meController;
