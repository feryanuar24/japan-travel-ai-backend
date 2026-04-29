import express from "express";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  generateItineraryLimiter,
  generateItineraryValidator,
  saveItineraryValidator,
  saveItineraryLimiter,
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

itineraryRoute.post(
  "/generate",
  auth,
  generateItineraryLimiter,
  validate(generateItineraryValidator),
  generateItineraryController,
);

itineraryRoute.post(
  "/save",
  auth,
  saveItineraryLimiter,
  validate(saveItineraryValidator),
  saveItineraryController,
);

itineraryRoute.get("/", auth, listItinerariesController);
itineraryRoute.get("/:id", auth, getItineraryController);

itineraryRoute.put(
  "/:id",
  auth,
  validate(saveItineraryValidator),
  updateItineraryController,
);

itineraryRoute.delete("/:id", auth, deleteItineraryController);

export default itineraryRoute;
