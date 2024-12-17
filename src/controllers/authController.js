// src/controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { BaseController } from './BaseController.js';

dotenv.config();

export class AuthController extends BaseController {
    constructor() {
        super();
        this.authService = new AuthService();
    }

    refreshToken = async (req, res) => {
        await this.handleRequest(req, res, async () => {
            const { refreshToken } = req.body;
            
            if (!refreshToken) {
                return res.status(400).json({
                    message: 'Refresh token required',
                    code: 'REFRESH_TOKEN_REQUIRED'
                });
            }

            try {
                const tokens = await this.authService.refreshAccessToken(refreshToken);
                res.json({
                    message: 'Tokens refreshed successfully',
                    tokens
                });
            } catch (error) {
                res.status(401).json({
                    message: 'Invalid refresh token',
                    code: 'INVALID_REFRESH_TOKEN'
                });
            }
        });
    }

}
