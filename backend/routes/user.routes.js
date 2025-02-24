import { Router } from "express";
import { fetchAvailability, handleAuth } from "../controllers/user.controller.js";
import refreshTokenController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const userRoutes = Router()

userRoutes.route("/auth").get(handleAuth)
userRoutes.route("/availability").post(authMiddleware,fetchAvailability)
userRoutes.route("/refresh-token").post(refreshTokenController)

userRoutes.post("/refresh", refreshTokenController);
export default userRoutes;