import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import type { Express, Request, Response, NextFunction } from "express";

const authMock = vi.fn((req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  req.user = { id: "user-id" };
  next();
});

const indexProfileMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "profile ok" });
});
const updateProfileMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "profile update ok" });
});
const destroyProfileMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "profile delete ok" });
});

vi.mock("../middlewares/auth.middleware.js", () => ({
  default: authMock,
}));
vi.mock("../controllers/profile.controller.js", () => ({
  indexProfile: indexProfileMock,
  updateProfile: updateProfileMock,
  destroyProfile: destroyProfileMock,
}));

let app: Express;

beforeAll(async () => {
  app = (await import("../app.js")).default;
}, 30000);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("profile routes", () => {
  it("blocks access without token", async () => {
    const res = await request(app).get("/api/profile");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No token");
    expect(indexProfileMock).not.toHaveBeenCalled();
  });

  it("retrieves profile with token", async () => {
    const res = await request(app)
      .get("/api/profile")
      .set("Authorization", "Bearer test");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("profile ok");
    expect(indexProfileMock).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid update payload", async () => {
    const res = await request(app)
      .put("/api/profile/update")
      .set("Authorization", "Bearer test")
      .send({ email: "not-email" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation error");
    expect(updateProfileMock).not.toHaveBeenCalled();
  });

  it("updates profile with valid payload", async () => {
    const res = await request(app)
      .put("/api/profile/update")
      .set("Authorization", "Bearer test")
      .send({ name: "Updated Name" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("profile update ok");
    expect(updateProfileMock).toHaveBeenCalledTimes(1);
  });

  it("deletes profile with token", async () => {
    const res = await request(app)
      .delete("/api/profile/delete")
      .set("Authorization", "Bearer test");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("profile delete ok");
    expect(destroyProfileMock).toHaveBeenCalledTimes(1);
  });
});
