import express from "express";
import validate from "../middlewares/validate.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import { storeUser, destroyUser, indexUser, showUser, updateUser } from "../controllers/user.controller.js";
import { storeUserValidator, updateUserValidator } from "../requests/user.request.js";

const userRoute = express.Router();

userRoute.get("/", auth, indexUser);
userRoute.post("/store", auth, validate(storeUserValidator), storeUser);
userRoute.get("/:id", auth, showUser);
userRoute.put("/:id/update", auth, validate(updateUserValidator), updateUser);
userRoute.delete("/:id/delete", auth, destroyUser);

export default userRoute;