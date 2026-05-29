import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { z } from "zod";

export const forgotPasswordValidator = z.object({
  body: z.object({
    email: z.email(),
  }),
});

export const resetPasswordValidator = z.object({
  body: z.object({
    token: z.string().min(1),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
  }),
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => {
    if (!req.ip) {
      throw new Error("IP address not found");
    }
    return `${ipKeyGenerator(req.ip)}-${req.body.email}`;
  },
  message: {
    status: false,
    message: "Too many password reset requests, please try again later",
    data: null,
  },
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  message: {
    status: false,
    message: "Too many password reset attempts, please try again later",
    data: null,
  },
});
