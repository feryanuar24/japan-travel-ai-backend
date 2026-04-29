import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import type { Express, NextFunction, Request, Response } from "express";

const authMock = vi.fn((req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  req.user = {
    id: "user-id",
    role: (req.headers["x-test-role"] as "user" | "admin" | undefined),
  };
  next();
});

const indexUserMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "index ok" });
});
const storeUserMock = vi.fn((req: Request, res: Response) => {
  return res.status(201).json({ message: "store ok" });
});
const showUserMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "show ok" });
});
const updateUserMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "update ok" });
});
const destroyUserMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "delete ok" });
});

vi.mock("../middlewares/auth.middleware.js", () => ({
  default: authMock,
}));
vi.mock("../controllers/user.controller.js", () => ({
  indexUser: indexUserMock,
  storeUser: storeUserMock,
  showUser: showUserMock,
  updateUser: updateUserMock,
  destroyUser: destroyUserMock,
}));

let app: Express;

beforeAll(async () => {
  app = (await import("../app.js")).default;
}, 30000);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("user routes", () => {
  it("blocks access without token", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No token");
    expect(indexUserMock).not.toHaveBeenCalled();
  });

  it("forbids non-admin users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", "Bearer test")
      .set("x-test-role", "user");

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Forbidden");
    expect(indexUserMock).not.toHaveBeenCalled();
  });

  it("lists users with token", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", "Bearer test")
      .set("x-test-role", "admin");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("index ok");
    expect(indexUserMock).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid store payload", async () => {
    const res = await request(app)
      .post("/api/users/store")
      .set("Authorization", "Bearer test")
      .set("x-test-role", "admin")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation error");
    expect(storeUserMock).not.toHaveBeenCalled();
  });

  it("creates user with valid payload", async () => {
    const res = await request(app)
      .post("/api/users/store")
      .set("Authorization", "Bearer test")
      .set("x-test-role", "admin")
      .send({
        name: "Test User",
        email: "test@example.com",
        role: "user",
        password: "Password1!",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("store ok");
    expect(storeUserMock).toHaveBeenCalledTimes(1);
  });

  it("shows user by id", async () => {
    const res = await request(app)
      .get("/api/users/123")
      .set("Authorization", "Bearer test")
      .set("x-test-role", "admin");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("show ok");
    expect(showUserMock).toHaveBeenCalledTimes(1);
    expect(showUserMock.mock.calls[0]?.[0].params.id).toBe("123");
  });

  it("rejects invalid update payload", async () => {
    const res = await request(app)
      .put("/api/users/123/update")
      .set("Authorization", "Bearer test")
      .set("x-test-role", "admin")
      .send({ email: "not-email" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation error");
    expect(updateUserMock).not.toHaveBeenCalled();
  });

  it("updates user with valid payload", async () => {
    const res = await request(app)
      .put("/api/users/123/update")
      .set("Authorization", "Bearer test")
      .set("x-test-role", "admin")
      .send({ name: "Updated User" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("update ok");
    expect(updateUserMock).toHaveBeenCalledTimes(1);
  });

  it("deletes user by id", async () => {
    const res = await request(app)
      .delete("/api/users/123/delete")
      .set("Authorization", "Bearer test")
      .set("x-test-role", "admin");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("delete ok");
    expect(destroyUserMock).toHaveBeenCalledTimes(1);
  });
});
