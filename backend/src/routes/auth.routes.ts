import { Router } from "express";
import {
  changePassword,
  currentUser,
  deleteAccount,
  forgotPassword,
  login,
  logoutUser,
  refreshAllTokens,
  registerUser,
  updateAccount,
  verifyAccount,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  userAccountUpdateSchema,
  userSchema,
} from "../lib/zodValidaters.js";
import { verifyJWT } from "../middlewares/auth.js";
const router = Router();

router.post("/register", validate(userSchema), registerUser);
router.patch("/verify-account", verifyAccount);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.patch(
  "/change-password",
  validate(changePasswordSchema),
  changePassword
);
router.patch("/logout", verifyJWT, logoutUser);
router.patch("/refresh-access-token", verifyJWT, refreshAllTokens);
router.get("/get-current-user", verifyJWT, currentUser);
router.delete("/delete-account", verifyJWT, deleteAccount);
router.put(
  "/update-account",
  verifyJWT,
  validate(userAccountUpdateSchema),
  updateAccount
);


export default router;
