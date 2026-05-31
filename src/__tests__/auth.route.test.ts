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

// Additional mocks for cookie/auth tests and logout
const findOneMock = vi.fn();
const findByIdMock = vi.fn();
const compareMock = vi.fn();
const signMock = vi.fn();
const verifyMock = vi.fn();
const sendMailMock = vi.fn();
const registerMailMock = vi.fn();

vi.mock("../models/user.model.js", () => ({
  default: {
    findOne: findOneMock,
    findById: findByIdMock,
  },
}));
vi.mock("bcryptjs", () => ({
  default: {
    compare: compareMock,
    hash: vi.fn(),
  },
}));
vi.mock("jsonwebtoken", () => ({
  default: {
    sign: signMock,
    verify: verifyMock,
  },
}));
vi.mock("../services/mail.service.js", () => ({
  sendMail: sendMailMock,
}));
vi.mock("../templates/mail.template.js", () => ({
  registerMail: registerMailMock,
}));

// Mock auth middleware to allow logout route in tests
const authMock = vi.fn((req: Request, res: Response, next: any) => {
  req.user = { id: "user-id" };
  next();
});
vi.mock("../middlewares/auth.middleware.js", () => ({
  default: authMock,
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
      role: "user",
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
      .post("/api/auth/reset-password")
      .send({ password: "Password1!" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation error");
    expect(resetPasswordControllerMock).not.toHaveBeenCalled();
  });

  it("accepts reset token with password", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: "token", password: "Password1!" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("reset ok");
    expect(resetPasswordControllerMock).toHaveBeenCalledTimes(1);
  });

  // Cookie & logout tests
  describe("cookie auth and logout", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      process.env.JWT_SECRET = "jwt-secret";
      process.env.CLIENT_ORIGIN = "http://localhost:3000";
      signMock.mockReturnValue("signed-token");
      verifyMock.mockReturnValue({ id: "user-id" });
      registerMailMock.mockReturnValue("<html />");
      sendMailMock.mockResolvedValue(undefined);
    });

    it("sets the jwt in an HttpOnly cookie", async () => {
      const safeUser = {
        _id: "user-id",
        name: "Test User",
        email: "test@example.com",
        role: "user",
        emailVerifiedAt: new Date().toISOString(),
      };

      findOneMock.mockResolvedValue({
        _id: "user-id",
        password: "hashed-password",
        emailVerifiedAt: new Date().toISOString(),
      });
      findByIdMock.mockReturnValue({
        select: vi.fn().mockResolvedValue(safeUser),
      });
      compareMock.mockResolvedValue(true);
      // Create a temporary express app wired to the real login controller
      const { default: expressLib } = await import("express");
      const { loginController } = await vi.importActual(
        "../controllers/auth/login.controller.js",
      );

      const tmpApp = expressLib();
      tmpApp.use(expressLib.json());
      tmpApp.post("/login", // @ts-ignore
        loginController,
      );

      const res = await request(tmpApp).post("/login").send({
        email: "test@example.com",
        password: "Password1!",
      });

      expect(res.status).toBe(200);
      const cookieHeader = res.headers["set-cookie"]?.[0] ?? "";
      expect(cookieHeader).toContain("token=signed-token");
      expect(cookieHeader).toContain("HttpOnly");
      expect(cookieHeader).toContain("Path=/");
      expect(cookieHeader).toContain("SameSite=Lax");
    });

    it("clears the token cookie on logout", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", "token=signed-token");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logout successful");

      const cookieHeader = res.headers["set-cookie"]?.[0] ?? "";
      expect(cookieHeader).toContain("token=");
      // ensure cookie is cleared (empty value or Expires/Max-Age)
      expect(
        cookieHeader.includes("Expires=") || cookieHeader.includes("Max-Age=0") || cookieHeader.includes("token=;")
      ).toBeTruthy();
    });
  });
});
