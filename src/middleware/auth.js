import { AuthService } from "../services/AuthService";

export const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                message: 'Authentication required',
                code: 'TOKEN_REQUIRED'
            });
        }

        // Verify token
        const authService = new AuthService();
        try {
            const decoded = await authService.verifyAccessToken(token);
            req.user = await User.findByPk(decoded.userId);
            next();
        } catch (error) {
            return res.status(401).json({ 
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }
    } catch (error) {
        res.status(401).json({ 
            message: 'Authentication failed',
            code: 'AUTH_FAILED'
        });
    }
};