import rateLimit from "express-rate-limit";
import { z } from "zod";

export const verifyEmailValidator = z.object({
  query: z.object({
    token: z.string().min(1),
  }),
});

export const verifyEmailLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: {
    status: false,
    message: "Too many verification attempts, please try again later",
    data: null,
  },
});
