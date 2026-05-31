import type { Request, Response } from "express";

export const logoutController = async (req: Request, res: Response) => {
  const isProduction = process.env.APP_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  return res.json({
    status: true,
    message: "Logout successful",
    data: null,
  });
};

export default logoutController;
