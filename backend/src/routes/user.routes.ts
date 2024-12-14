import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { getFilteredUsers, getUserById } from "../controllers/user.controllers.js";
import { validateQuery } from "../middlewares/validator.js";
import { userAccountUpdateSchema } from "../lib/zodValidaters.js";

const router = Router();

router.route("/get-users").get(verifyJWT, validateQuery(userAccountUpdateSchema), getFilteredUsers)
router.get("/get-user", getUserById);

export default router;