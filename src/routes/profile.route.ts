import express from "express";
import validate from "../middlewares/validate.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import {
  destroyProfile,
  indexProfile,
  updateProfile,
} from "../controllers/profile.controller.js";
import { updateProfileValidator } from "../requests/profile.request.js";

const profileRoute = express.Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get current user profile
 *     description: Retrieve the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                         emailVerifiedAt:
 *                           type: string
 *       401:
 *         description: Unauthorized
 */
profileRoute.get("/", auth, indexProfile);

/**
 * @swagger
 * /api/profile/update:
 *   put:
 *     tags:
 *       - Profile
 *     summary: Update current user profile
 *     description: Update the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Updated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.updated@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewSecure@Password123
 *                 description: Must contain uppercase, lowercase, number, and special character
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                         emailVerifiedAt:
 *                           type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
profileRoute.put(
  "/update",
  auth,
  validate(updateProfileValidator),
  updateProfile,
);

/**
 * @swagger
 * /api/profile/delete:
 *   delete:
 *     tags:
 *       - Profile
 *     summary: Delete current user account
 *     description: Delete the authenticated user's account and all related data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                  type: string
 *                 data:
 *                  type: object
 *                  properties: 
  *                   user:
  *                     type: object
  *                     properties:
  *                       _id:
  *                         type: string
  *                       name:
  *                         type: string
  *                       email:
  *                         type: string
  *                       role:
  *                         type: string
  *                       emailVerifiedAt:
  *                         type: string
 *       401:
 *         description: Unauthorized
 */
profileRoute.delete("/delete", auth, destroyProfile);

export default profileRoute;
