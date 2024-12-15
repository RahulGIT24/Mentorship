import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { getNotifications, readNotification } from "../controllers/notification.controller.js";

const router = Router();

router.get("/get-notifications",verifyJWT,getNotifications)
router.get("/read-notification",verifyJWT,readNotification)

export default router;