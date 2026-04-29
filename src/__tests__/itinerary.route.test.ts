import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import type { Express, NextFunction, Request, Response } from "express";

const authMock = vi.fn((req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  req.user = { id: "user-id", _id: "user-id" };
  next();
});

const generateItineraryControllerMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "itinerary generated ok" });
});

const saveItineraryControllerMock = vi.fn((req: Request, res: Response) => {
  return res.status(201).json({ message: "itinerary saved ok" });
});

const listItinerariesControllerMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "itineraries list ok" });
});

const getItineraryControllerMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "itinerary retrieved ok" });
});

const updateItineraryControllerMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "itinerary updated ok" });
});

const deleteItineraryControllerMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "itinerary deleted ok" });
});

vi.mock("../middlewares/auth.middleware.js", () => ({
  default: authMock,
}));
vi.mock("../controllers/itinerary.controller.js", () => ({
  generateItineraryController: generateItineraryControllerMock,
  saveItineraryController: saveItineraryControllerMock,
  listItinerariesController: listItinerariesControllerMock,
  getItineraryController: getItineraryControllerMock,
  updateItineraryController: updateItineraryControllerMock,
  deleteItineraryController: deleteItineraryControllerMock,
}));

let app: Express;

beforeAll(async () => {
  app = (await import("../app.js")).default;
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("itinerary routes", () => {
  describe("generate endpoint", () => {
    it("blocks request without token", async () => {
      const res = await request(app).post("/api/itinerary/generate").send({});

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("No token");
      expect(generateItineraryControllerMock).not.toHaveBeenCalled();
    });

    it("rejects invalid generate payload", async () => {
      const res = await request(app)
        .post("/api/itinerary/generate")
        .set("Authorization", "Bearer test")
        .send({
          durationDays: 0,
          budget: -100,
          destinations: [],
          preferences: [],
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Validation error");
      expect(generateItineraryControllerMock).not.toHaveBeenCalled();
    });

    it("accepts valid generate payload", async () => {
      const res = await request(app)
        .post("/api/itinerary/generate")
        .set("Authorization", "Bearer test")
        .send({
          durationDays: 5,
          budget: 150000,
          destinations: ["osaka", "tokyo", "osaka"],
          preferences: ["culinary", "anime", "nature"],
          pace: "medium",
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("itinerary generated ok");
      expect(generateItineraryControllerMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("save endpoint", () => {
    it("blocks request without token", async () => {
      const res = await request(app).post("/api/itinerary/save").send({});

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("No token");
      expect(saveItineraryControllerMock).not.toHaveBeenCalled();
    });

    it("rejects invalid save payload", async () => {
      const res = await request(app)
        .post("/api/itinerary/save")
        .set("Authorization", "Bearer test")
        .send({
          title: "Test",
          aiGenerated: true,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Validation error");
      expect(saveItineraryControllerMock).not.toHaveBeenCalled();
    });

    it("accepts valid save payload", async () => {
      const res = await request(app)
        .post("/api/itinerary/save")
        .set("Authorization", "Bearer test")
        .send({
          title: "My Japan Trip",
          description: "5 days in Japan",
          aiGenerated: true,
          summary: {
            totalDays: 5,
            totalBudget: 150000,
            currency: "JPY",
            destinations: ["osaka", "tokyo"],
            preferences: ["culinary", "anime"],
            strategy: "Balanced travel plan",
          },
          days: [
            {
              day: 1,
              city: "Osaka",
              theme: "culinary",
              estimatedDailyBudget: 30000,
              activities: [
                {
                  time: "09:00-11:00",
                  title: "Food walk at Dotonbori",
                  category: "culinary",
                  estimatedCost: 5000,
                  notes: "Try takoyaki and okonomiyaki",
                },
              ],
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("itinerary saved ok");
      expect(saveItineraryControllerMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("list endpoint", () => {
    it("blocks request without token", async () => {
      const res = await request(app).get("/api/itinerary");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("No token");
      expect(listItinerariesControllerMock).not.toHaveBeenCalled();
    });

    it("lists itineraries with token", async () => {
      const res = await request(app)
        .get("/api/itinerary")
        .set("Authorization", "Bearer test");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("itineraries list ok");
      expect(listItinerariesControllerMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("get endpoint", () => {
    it("blocks request without token", async () => {
      const res = await request(app).get("/api/itinerary/123");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("No token");
      expect(getItineraryControllerMock).not.toHaveBeenCalled();
    });

    it("gets itinerary by id with token", async () => {
      const res = await request(app)
        .get("/api/itinerary/123")
        .set("Authorization", "Bearer test");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("itinerary retrieved ok");
      expect(getItineraryControllerMock).toHaveBeenCalledTimes(1);
      expect(getItineraryControllerMock.mock.calls[0]?.[0].params.id).toBe(
        "123",
      );
    });
  });

  describe("update endpoint", () => {
    it("blocks request without token", async () => {
      const res = await request(app)
        .put("/api/itinerary/123")
        .send({ title: "Updated" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("No token");
      expect(updateItineraryControllerMock).not.toHaveBeenCalled();
    });

    it("updates itinerary with valid payload", async () => {
      const res = await request(app)
        .put("/api/itinerary/123")
        .set("Authorization", "Bearer test")
        .send({
          title: "Updated Title",
          aiGenerated: true,
          summary: {
            totalDays: 5,
            totalBudget: 150000,
            currency: "JPY",
            destinations: ["osaka"],
            preferences: ["culinary"],
            strategy: "Updated strategy",
          },
          days: [],
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("itinerary updated ok");
      expect(updateItineraryControllerMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("delete endpoint", () => {
    it("blocks request without token", async () => {
      const res = await request(app).delete("/api/itinerary/123");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("No token");
      expect(deleteItineraryControllerMock).not.toHaveBeenCalled();
    });

    it("deletes itinerary with token", async () => {
      const res = await request(app)
        .delete("/api/itinerary/123")
        .set("Authorization", "Bearer test");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("itinerary deleted ok");
      expect(deleteItineraryControllerMock).toHaveBeenCalledTimes(1);
    });
  });
});
