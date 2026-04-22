import rateLimit from "express-rate-limit";
import { z } from "zod";

export const verifyEmailValidator = z.object({
  query: z.object({
    token: z.string().min(1),
  }),
});

export const verifyEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many verification attempts, please try again later",
  },
});
