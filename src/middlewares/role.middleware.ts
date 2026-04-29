import type { NextFunction, Request, Response } from "express";

type RoleUser = {
  role?: "user" | "admin";
};

const role =
  (...allowedRoles: Array<"user" | "admin">) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req.user as RoleUser | undefined)?.role;

    if (!userRole) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };

export default role;
