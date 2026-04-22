import express from "express";
import validate from "../middlewares/validate.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import { destroyProfile, indexProfile, updateProfile } from "../controllers/profile.controller.js";
import { updateProfileValidator } from "../requests/profile.request.js";

const profileRoute = express.Router();

profileRoute.get("/", auth, indexProfile);
profileRoute.put("/update", auth, validate(updateProfileValidator), updateProfile);
profileRoute.delete("/delete", auth, destroyProfile);

export default profileRoute;