import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { z } from "zod";

export const loginValidator = z.object({
    body: z.object({
        email: z.email(),
        password: z.string().min(1),
    }),
});

export const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 5,
    keyGenerator: (req) => {
        if (!req.ip) {
            throw new Error("IP address not found");
        }
        return `${ipKeyGenerator(req.ip)}-${req.body.email}`;
    },
    message: {
        status: false,
        message: "Too many login attempts, please try again later",
        data: null
    },
});