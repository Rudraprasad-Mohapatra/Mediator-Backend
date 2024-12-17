// src/routes/authRoutes.js
import express from 'express';
import { AuthController } from '../controllers/authController.js';

const authController = new AuthController();
import { validateRegistration, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);

export default router;
