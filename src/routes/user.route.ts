import express from "express";
import validate from "../middlewares/validate.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import {
  storeUser,
  destroyUser,
  indexUser,
  showUser,
  updateUser,
} from "../controllers/user.controller.js";
import {
  storeUserValidator,
  updateUserValidator,
} from "../requests/user.request.js";
import role from "../middlewares/role.middleware.js";

const userRoute = express.Router();

userRoute.get("/", auth, role("admin"), indexUser);
userRoute.post(
  "/store",
  auth,
  role("admin"),
  validate(storeUserValidator),
  storeUser,
);
userRoute.get("/:id", auth, role("admin"), showUser);
userRoute.put(
  "/:id/update",
  auth,
  role("admin"),
  validate(updateUserValidator),
  updateUser,
);
userRoute.delete("/:id/delete", auth, role("admin"), destroyUser);

export default userRoute;
