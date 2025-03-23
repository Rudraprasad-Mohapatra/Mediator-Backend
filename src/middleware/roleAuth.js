import { AuthError } from "../utils/errors.js";

export const roleAuth = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new AuthError("User not authenticated");
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Access forbidden",
                    code: "ROLE_FORBIDDEN",
                });
            }

            next();
        } catch (error) {
            res.status(401).json({
                message: "Authorization failed",
                code: "AUTH_FAILED",
            });
        }
    };
};
