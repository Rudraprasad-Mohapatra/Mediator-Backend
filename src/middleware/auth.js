import { AuthService } from "../services/AuthService.js";
import User from "../models/User.js";

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                message: 'Authentication required',
                code: 'TOKEN_REQUIRED'
            });
        }

        const authService = new AuthService();
        const decoded = await authService.verifyAccessToken(token);
        const user = await User.findByPk(decoded.userId);
        
        if (!user || user.status !== 'active') {
            return res.status(401).json({ 
                message: 'User not found or inactive',
                code: 'USER_INVALID'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.message === 'Invalid access token') {
            return res.status(401).json({ 
                message: 'Token expired or invalid',
                code: 'TOKEN_INVALID'
            });
        }
        res.status(500).json({ 
            message: 'Authentication failed',
            code: 'AUTH_FAILED'
        });
    }
};