import rateLimit from "express-rate-limit";
import { z } from "zod";

export const registerValidator = z.object({
    body: z.object({
        name: z.string().min(1),
        email: z.email(),
        password: z
            .string()
            .min(8)
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    }),
});

export const registerLimiter = rateLimit(
    {
        windowMs: 60 * 60 * 1000,
        max: 10,
        message: {
            message: "Too many registration attempts, please try again later",
        },
    }
);
