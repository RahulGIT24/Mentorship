import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { getFilteredUsers, getUserById } from "../controllers/user.controller.js";
import { validate, validateQuery } from "../middlewares/validator.js";
import { userAccountUpdateSchema } from "../lib/zodValidaters.js";
import { currentUser, deleteAccount, updateAccount } from "../controllers/user.controller.js";

const router = Router();

router.route("/get-users").get(verifyJWT, validateQuery(userAccountUpdateSchema), getFilteredUsers)
router.get("/get-user", getUserById);
router.get("/get-current-user", verifyJWT, currentUser);
router.delete("/delete-account", verifyJWT, deleteAccount);
router.put(
  "/update-account",
  verifyJWT,
  validate(userAccountUpdateSchema),
  updateAccount
);

export default router;