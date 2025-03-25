// src/routes/authRoutes.js
import express from "express";
import { AuthController } from "../controllers/authController.js";
import {
    validateRegistration,
    validateLogin,
} from "../middleware/validation.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const authController = new AuthController();

router.post("/register", validateRegistration, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", auth, authController.logout);

export default router;
