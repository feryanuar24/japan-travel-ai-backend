import express from "express";
import {
  registerLimiter,
  registerValidator,
} from "../requests/auth/register.request.js";
import { loginLimiter, loginValidator } from "../requests/auth/login.request.js";
import {
  verifyEmailLimiter,
  verifyEmailValidator,
} from "../requests/auth/email.request.js";
import {
  forgotPasswordLimiter,
  forgotPasswordValidator,
  resetPasswordLimiter,
  resetPasswordValidator,
} from "../requests/auth/password.request.js";
import validate from "../middlewares/validate.middleware.js";
import { registerController } from "../controllers/auth/register.controller.js";
import { loginController } from "../controllers/auth/login.controller.js";
import {
  verifyEmailController,
} from "../controllers/auth/email.controller.js";
import {
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth/password.controller.js";

const authRoute = express.Router();

authRoute.post(
  "/register",
  registerLimiter,
  validate(registerValidator),
  registerController,
);

authRoute.post(
  "/login",
  loginLimiter,
  validate(loginValidator),
  loginController,
);

authRoute.get(
  "/verify-email",
  verifyEmailLimiter,
  validate(verifyEmailValidator),
  verifyEmailController,
);

authRoute.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validate(forgotPasswordValidator),
  forgotPasswordController,
);
authRoute.get(
  "/reset-password",
  resetPasswordLimiter,
  validate(resetPasswordValidator),
  resetPasswordController,
);

export default authRoute;
