import express from "express";
import {
  registerLimiter,
  registerValidator,
} from "../requests/auth/register.request.js";
import {
  loginLimiter,
  loginValidator,
} from "../requests/auth/login.request.js";
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
import { verifyEmailController } from "../controllers/auth/email.controller.js";
import {
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth/password.controller.js";

const authRoute = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Create a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                  status:
 *                      type: boolean
 *                  message:
 *                      type: string
 *                  data:
 *                      type: object
 *                      properties: 
 *                         user:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                  type: string
 *                               name:
 *                                 type: string
 *                               email:  
 *                                  type: string
 *                               role:
 *                                  type: string
 *                               emailVerifiedAt:
 *                                  type: string
 *       400:
 *         description: Invalid input or validation error
 *       429:
 *         description: Too many registration attempts
 */
authRoute.post(
  "/register",
  registerLimiter,
  validate(registerValidator),
  registerController,
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticate user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *          application/json:
 *            schema:
 *             type: object
 *             properties:
 *               status:
 *                type: boolean
 *               message:
 *                type: string
 *               data:
 *                type: object
 *                properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     emailVerifiedAt:
 *                       type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */
authRoute.post(
  "/login",
  loginLimiter,
  validate(loginValidator),
  loginController,
);

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Verify user email
 *     description: Verify email using a token.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *          application/json:
 *            schema:
 *             type: object
 *             properties:
 *               status:
 *                type: boolean
 *               message:
 *                type: string
 *               data:
 *                type: object
 *                properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     emailVerifiedAt:
 *                       type: string
 *       400:
 *         description: Invalid or expired token
 *       429:
 *         description: Too many verification attempts
 */
authRoute.get(
  "/verify-email",
  verifyEmailLimiter,
  validate(verifyEmailValidator),
  verifyEmailController,
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request password reset
 *     description: Send password reset link to user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *          application/json:
 *            schema:
 *             type: object
 *             properties:
 *               status:
 *                type: boolean
 *               message:
 *                type: string
 *               data:
 *                type: object   
 *                properties:
 *                  user:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                      name:
 *                        type: string
 *                      email:
 *                        type: string
 *                      role:
 *                        type: string
 *                      emailVerifiedAt:
 *                        type: string
 *       400:
 *         description: Invalid email
 *       429:
 *         description: Too many requests
 */
authRoute.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validate(forgotPasswordValidator),
  forgotPasswordController,
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Reset user password
 *     description: Reset password using token and new password.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - password
 *                  properties:
 *                    password:
 *                     type: string
 *                     format: password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: boolean
 *                      message:
 *                          type: string
 *                      data:
 *                         type: object
 *                         properties:
 *                          user:
 *                            type: object
 *                            properties:
 *                             _id:
 *                              type: string
 *                             name:
 *                              type: string
 *                             email:
 *                              type: string
 *                             role:
 *                              type: string
 *                             emailVerifiedAt:
 *                              type: string
 *       400:
 *         description: Invalid or expired token
 *       429:
 *         description: Too many requests
 */
authRoute.get(
  "/reset-password",
  resetPasswordLimiter,
  validate(resetPasswordValidator),
  resetPasswordController,
);

export default authRoute;
