import rateLimit from "express-rate-limit";
import { z } from "zod";

export const generateItineraryValidator = z.object({
  body: z.object({
    durationDays: z.number().int().min(1).max(30),
    budget: z.number().positive(),
    currency: z.string().trim().min(3).max(8).optional(),
    destinations: z.array(z.string().trim().min(2)).min(1).max(20),
    preferences: z.array(z.string().trim().min(2)).min(1).max(10),
    pace: z.enum(["slow", "medium", "fast"]).optional(),
    startDate: z.string().datetime().optional(),
  }),
});

export const saveItineraryValidator = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().max(1000).optional(),
    aiGenerated: z.boolean().optional(),
    summary: z.object({
      totalDays: z.number().int().positive(),
      totalBudget: z.number().positive(),
      currency: z.string().trim().min(3).max(8),
      destinations: z.array(z.string().trim().min(2)),
      preferences: z.array(z.string().trim().min(2)),
      strategy: z.string().trim(),
    }),
    days: z.array(
      z.object({
        day: z.number().int().positive(),
        city: z.string().trim().min(1),
        theme: z.string().trim().min(1),
        estimatedDailyBudget: z.number().positive(),
        activities: z.array(
          z.object({
            time: z.string().trim(),
            title: z.string().trim().min(1),
            category: z.string().trim().min(1),
            estimatedCost: z.number().nonnegative(),
            notes: z.string().trim(),
          }),
        ),
      }),
    ),
    isPublished: z.boolean().optional(),
  }),
});

export const generateItineraryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    message: "Too many itinerary generation requests, please try again later",
  },
});
