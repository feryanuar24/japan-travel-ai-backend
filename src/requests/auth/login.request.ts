import rateLimit from "express-rate-limit";
import { z } from "zod";

export const loginValidator = z.object({
    body: z.object({
        email: z.email(),
        password: z.string().min(1),
    }),
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: {
        message: "Too many login attempts, please try again later",
    },
});