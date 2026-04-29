import { z } from "zod";

export const storeUserValidator = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.email(),
    role: z.enum(["user", "admin"]),
    password: z
      .string()
      .min(8,)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  }),
});

export const updateUserValidator = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    role: z.enum(["user", "admin"]).optional(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
      .optional(),
  }),
});