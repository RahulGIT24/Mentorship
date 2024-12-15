import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { acceptReq, checkConnected, deleteConnection, getConnections, getPendingRequests, sendReq } from "../controllers/connection.controller.js";

const router = Router();

router.post("/send-request",verifyJWT,sendReq)
router.post("/accept-request",verifyJWT,acceptReq)
router.get("/get-accepted-connections",verifyJWT,getConnections)
router.get("/get-pending-requests",verifyJWT,getPendingRequests)
router.get("/check-connection",verifyJWT,checkConnected)
router.delete("/delete-connection",verifyJWT,deleteConnection)

export default router;