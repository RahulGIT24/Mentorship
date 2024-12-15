import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { matchMeWith } from "../controllers/match.controller.js";

const router = Router();

router.post("/get-matched-users",verifyJWT,matchMeWith)

export default router;