import express from "express";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  generateItineraryLimiter,
  generateItineraryValidator,
  saveItineraryValidator,
} from "../requests/itinerary.request.js";
import {
  generateItineraryController,
  saveItineraryController,
  getItineraryController,
  listItinerariesController,
  updateItineraryController,
  deleteItineraryController,
} from "../controllers/itinerary.controller.js";

const itineraryRoute = express.Router();

/**
 * @swagger
 * /api/itinerary/generate:
 *   post:
 *     tags:
 *       - Itinerary
 *     summary: Generate AI itinerary
 *     description: Generate a Japan travel itinerary based on user preferences and AI analysis
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - durationDays
 *               - budget
 *               - destinations
 *               - preferences
 *             properties:
 *               durationDays:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 30
 *                 example: 7
 *               budget:
 *                 type: number
 *                 example: 5000
 *               currency:
 *                 type: string
 *                 example: USD
 *                 description: Currency code (3-8 characters)
 *               destinations:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Tokyo, Kyoto, Osaka]
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [temples, nature, nightlife]
 *               pace:
 *                 type: string
 *                 enum: [slow, medium, fast]
 *                 example: medium
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-06-01T00:00:00Z
 *     responses:
 *       200:
 *         description: Itinerary generated successfully
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
 *                     itinerary:
 *                       type: object
 *                       properties:
 *                         aiGenerated:
 *                           type: boolean
 *                         summary:
 *                           type: object
 *                           properties:
 *                             totalDays:
 *                               type: integer
 *                             totalBudget:
 *                               type: number
 *                             currency:
 *                               type: string
 *                             destinations:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             preferences:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             strategy:
 *                               type: string
 *                         days:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               day:
 *                                 type: integer
 *                               city:
 *                                 type: string
 *                               theme:
 *                                 type: string
 *                               estimatedDailyBudget:
 *                                 type: number
 *                               activities:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     time:
 *                                       type: string
 *                                     title:
 *                                       type: string
 *                                     category:
 *                                       type: string
 *                                     estimatedCost:
 *                                       type: number
 *                                     notes:
 *                                       type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too many generation requests
 */
itineraryRoute.post(
  "/generate",
  auth,
  generateItineraryLimiter,
  validate(generateItineraryValidator),
  generateItineraryController,
);

/**
 * @swagger
 * /api/itinerary/save:
 *   post:
 *     tags:
 *       - Itinerary
 *     summary: Save itinerary
 *     description: Save an itinerary for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - summary
 *               - days
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Japan Adventure
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 example: A wonderful 7-day trip to Japan
 *                 maxLength: 1000
 *               aiGenerated:
 *                 type: boolean
 *                 example: true
 *               summary:
 *                 type: object
 *                 required:
 *                   - totalDays
 *                   - totalBudget
 *                   - currency
 *                   - destinations
 *                   - preferences
 *                   - strategy
 *                 properties:
 *                   totalDays:
 *                     type: integer
 *                     example: 7
 *                   totalBudget:
 *                     type: number
 *                     example: 5000
 *                   currency:
 *                     type: string
 *                     example: USD
 *                   destinations:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: [Tokyo, Kyoto, Osaka]
 *                   preferences:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: [temples, nature]
 *                   strategy:
 *                     type: string
 *                     example: Balanced mix of culture and relaxation
 *               days:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - day
 *                     - city
 *                     - theme
 *                     - estimatedDailyBudget
 *                     - activities
 *                   properties:
 *                     day:
 *                       type: integer
 *                       example: 1
 *                     city:
 *                       type: string
 *                       example: Tokyo
 *                     theme:
 *                       type: string
 *                       example: Urban Culture
 *                     estimatedDailyBudget:
 *                       type: number
 *                       example: 800
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - time
 *                           - title
 *                           - category
 *                           - estimatedCost
 *                           - notes
 *                         properties:
 *                           time:
 *                             type: string
 *                             example: "09:00"
 *                           title:
 *                             type: string
 *                             example: Visit Senso-ji Temple
 *                           category:
 *                             type: string
 *                             example: Historical Site
 *                           estimatedCost:
 *                             type: number
 *                             example: 50
 *                           notes:
 *                             type: string
 *                             example: Popular tourist destination
 *               isPublished:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Itinerary saved successfully
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
 *                     itinerary:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         userId:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         aiGenerated:
 *                           type: boolean
 *                         summary:
 *                           type: object
 *                           properties:
 *                             totalDays:
 *                               type: integer
 *                             totalBudget:
 *                               type: number
 *                             currency:
 *                               type: string
 *                             destinations:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             preferences:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             strategy:
 *                               type: string
 *                         days:
 *                           type: array
 *                         isPublished:
 *                           type: boolean
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
itineraryRoute.post(
  "/save",
  auth,
  validate(saveItineraryValidator),
  saveItineraryController,
);

/**
 * @swagger
 * /api/itinerary:
 *   get:
 *     tags:
 *       - Itinerary
 *     summary: List user itineraries
 *     description: Retrieve all itineraries for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Itineraries retrieved successfully
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
 *                     itineraries:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           userId:
 *                             type: string
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           aiGenerated:
 *                             type: boolean
 *                           summary:
 *                             type: object
 *                             properties:
 *                               totalDays:
 *                                 type: integer
 *                               totalBudget:
 *                                 type: number
 *                               currency:
 *                                 type: string
 *                               destinations:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                             preferences:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             strategy:
 *                               type: string
 *                           days:
 *                             type: array
 *                           isPublished:
 *                             type: boolean
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized
 */
itineraryRoute.get("/", auth, listItinerariesController);

/**
 * @swagger
 * /api/itinerary/{id}:
 *   get:
 *     tags:
 *       - Itinerary
 *     summary: Get itinerary details
 *     description: Retrieve a specific itinerary by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Itinerary ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Itinerary retrieved successfully
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
 *                     itinerary:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         userId:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         aiGenerated:
 *                           type: boolean
 *                         summary:
 *                           type: object
 *                           properties:
 *                             totalDays:
 *                               type: integer
 *                             totalBudget:
 *                               type: number
 *                             currency:
 *                               type: string
 *                             destinations:
 *                               type: array
 *                               items:
 *                                 type: string
 *                           preferences:
 *                             type: array
 *                             items:
 *                               type: string
 *                           strategy:
 *                             type: string
 *                         days:
 *                           type: array
 *                         isPublished:
 *                           type: boolean
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Itinerary not found
 */
itineraryRoute.get("/:id", auth, getItineraryController);

/**
 * @swagger
 * /api/itinerary/{id}:
 *   put:
 *     tags:
 *       - Itinerary
 *     summary: Update itinerary
 *     description: Update an existing itinerary
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Itinerary ID (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               summary:
 *                 type: object
 *               days:
 *                 type: array
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Itinerary updated successfully
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
 *                     itinerary:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         userId:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         aiGenerated:
 *                           type: boolean
 *                         summary:
 *                           type: object
 *                           properties:
 *                             totalDays:
 *                               type: integer
 *                             totalBudget:
 *                               type: number
 *                             currency:
 *                               type: string
 *                             destinations:
 *                               type: array
 *                               items:
 *                                 type: string
 *                           preferences:
 *                             type: array
 *                             items:
 *                               type: string
 *                           strategy:
 *                             type: string
 *                         days:
 *                           type: array
 *                         isPublished:
 *                           type: boolean
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Itinerary not found
 */
itineraryRoute.put(
  "/:id",
  auth,
  validate(saveItineraryValidator),
  updateItineraryController,
);

/**
 * @swagger
 * /api/itinerary/{id}:
 *   delete:
 *     tags:
 *       - Itinerary
 *     summary: Delete itinerary
 *     description: Delete an itinerary by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Itinerary ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Itinerary deleted successfully
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
 *                     itinerary:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         userId:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         aiGenerated:
 *                           type: boolean
 *                         summary:
 *                           type: object
 *                           properties:
 *                             totalDays:
 *                               type: integer
 *                             totalBudget:
 *                               type: number
 *                             currency:
 *                               type: string
 *                             destinations:
 *                               type: array
 *                               items:
 *                                 type: string
 *                           preferences:
 *                             type: array
 *                             items:
 *                               type: string
 *                           strategy:
 *                             type: string
 *                         days:
 *                           type: array
 *                         isPublished:
 *                           type: boolean
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Itinerary not found
 */
itineraryRoute.delete("/:id", auth, deleteItineraryController);

export default itineraryRoute;
