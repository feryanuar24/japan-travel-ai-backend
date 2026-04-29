import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import type { Express, Request, Response } from "express";


const registerControllerMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "register ok" });
});
const loginControllerMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "login ok" });
});
const verifyEmailControllerMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "verify ok" });
});
const forgotPasswordControllerMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "forgot ok" });
});
const resetPasswordControllerMock = vi.fn((req: Request, res: Response) => {
  return res.status(200).json({ message: "reset ok" });
});

vi.mock("../controllers/auth/register.controller.js", () => ({
  registerController: registerControllerMock,
}));
vi.mock("../controllers/auth/login.controller.js", () => ({
  loginController: loginControllerMock,
}));
vi.mock("../controllers/auth/email.controller.js", () => ({
  verifyEmailController: verifyEmailControllerMock,
}));
vi.mock("../controllers/auth/password.controller.js", () => ({
  forgotPasswordController: forgotPasswordControllerMock,
  resetPasswordController: resetPasswordControllerMock,
}));

let app: Express;

beforeAll(async () => {
  app = (await import("../app.js")).default;
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("auth routes", () => {
  it("rejects invalid register payload", async () => {
    const res = await request(app).post("/api/auth/register").send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation error");
    expect(registerControllerMock).not.toHaveBeenCalled();
  });

  it("accepts valid register payload", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password1!",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("register ok");
    expect(registerControllerMock).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid login payload", async () => {
    const res = await request(app).post("/api/auth/login").send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation error");
    expect(loginControllerMock).not.toHaveBeenCalled();
  });

  it("accepts valid login payload", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "Pass123",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("login ok");
    expect(loginControllerMock).toHaveBeenCalledTimes(1);
  });

  it("rejects missing verify token", async () => {
    const res = await request(app).get("/api/auth/verify-email");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation error");
    expect(verifyEmailControllerMock).not.toHaveBeenCalled();
  });

  it("accepts verify token", async () => {
    const res = await request(app)
      .get("/api/auth/verify-email")
      .query({ token: "token" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("verify ok");
    expect(verifyEmailControllerMock).toHaveBeenCalledTimes(1);
  });

  it("rejects missing forgot password email", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation error");
    expect(forgotPasswordControllerMock).not.toHaveBeenCalled();
  });

  it("accepts forgot password email", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "test@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("forgot ok");
    expect(forgotPasswordControllerMock).toHaveBeenCalledTimes(1);
  });

  it("rejects missing reset token", async () => {
    const res = await request(app)
      .get("/api/auth/reset-password")
      .send({ password: "Password1!" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation error");
    expect(resetPasswordControllerMock).not.toHaveBeenCalled();
  });

  it("accepts reset token with password", async () => {
    const res = await request(app)
      .get("/api/auth/reset-password")
      .query({ token: "token" })
      .send({ password: "Password1!" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("reset ok");
    expect(resetPasswordControllerMock).toHaveBeenCalledTimes(1);
  });
});
