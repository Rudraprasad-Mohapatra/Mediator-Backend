import jwt from "jsonwebtoken";
import User from "../models/user.js";

export class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET;
        this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    }

    generateTokens(userId) {
        // Access token - short lived (e.g., 15 minutes)
        const accessToken = jwt.sign(
            { userId, type: "access" },
            this.jwtSecret,
            { expiresIn: "15m" }
        );
        // Refresh token - long lived (e.g., 7 days)
        const refreshToken = jwt.sign(
            { userId, type: "refresh" },
            this.jwtRefreshSecret,
            { expiresIn: "7d" }
        );
        return { accessToken, refreshToken };
    }

    async verifyAccessToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            if (decoded.type !== "access") {
                throw new Error("Invalid token type");
            }
            return decoded;
        } catch (error) {
            throw new Error("Invalid access token");
        }
    }

    async refreshAccessToken(refreshToken) {
        try {
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret);
            if (decoded.type !== "refresh") {
                throw new Error("Invalid token type");
            }

            // Get user
            const user = await User.findByPk(decoded.userId);
            if (!user || user.refreshToken !== refreshToken) {
                throw new Error("Invalid refresh token");
            }

            // Generate new tokens
            const tokens = this.generateTokens(user.id);

            // Update refresh token in database
            await user.update({ refreshToken: tokens.refreshToken });

            return tokens;
        } catch (error) {
            throw new Error("Invalid refresh token");
        }
    }

    async register(userData) {
        const { email, password, username } = userData;

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        // Create new user
        const user = await User.create({
            email,
            password,
            username,
        });

        const tokens = this.generateTokens(user.id);
        await user.update({ refreshToken: tokens.refreshToken });

        return { user, tokens };
    }

    async login(email, password) {
        const user = await User.findByEmail(email);
        if (!user || !(await user.comparePassword(password))) {
            throw new Error("Invalid credentials");
        }

        const tokens = this.generateTokens(user.id);
        await user.update({ refreshToken: tokens.refreshToken });

        return { user, tokens };
    }

    async refreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret);
            const user = await User.findByPk(decoded.userId);

            if (!user || user.refreshToken !== refreshToken) {
                throw new Error("Invalid refresh token");
            }

            const tokens = this.generateTokens(user.id);
            await user.update({ refreshToken: tokens.refreshToken });

            return tokens;
        } catch (error) {
            throw new Error("Invalid refresh token");
        }
    }

    async logout(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Clear the refresh token in the database
        await user.update({ refreshToken: null });

        return { message: "Logged out successfully" };
    }

    setCookies(res, tokens) {
        // Set HTTP-only cookies
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/auth/refresh-token", // Only sent to refresh endpoint
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }

    clearCookies(res) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
    }
}
