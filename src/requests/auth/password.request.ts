import rateLimit from "express-rate-limit";
import { z } from "zod";

export const forgotPasswordValidator = z.object({
  body: z.object({
    email: z.email(),
  }),
});

export const resetPasswordValidator = z.object({
  body: z.object({
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  }),
  query: z.object({
    token: z.string().min(1),
  }),
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many password reset requests, please try again later",
  },
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many password reset attempts, please try again later",
  },
});
