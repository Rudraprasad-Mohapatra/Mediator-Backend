import { AuthService } from "../services/AuthService.js";
import { BaseController } from "./BaseController.js";

export class AuthController extends BaseController {
    constructor() {
        super();
        this.authService = new AuthService();
    }

    register = async (req, res) => {
        await this.handleRequest(req, res, async () => {
            const { user, tokens } = await this.authService.register(req.body);
            res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                },
                tokens,
            });
        });
    };

    login = async (req, res) => {
        await this.handleRequest(req, res, async () => {
            const { email, password } = req.body;
            const { user, tokens } = await this.authService.login(
                email,
                password
            );

            // Set HTTP-only cookies
            this.authService.setCookies(res, tokens);
            res.json({
                message: "Login successful",
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                },
                tokens,
            });
        });
    };

    refreshToken = async (req, res) => {
        await this.handleRequest(req, res, async () => {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({
                    message: "Refresh token required",
                    code: "REFRESH_TOKEN_REQUIRED",
                });
            }
            const tokens = await this.authService.refreshToken(refreshToken);

            this.authService.setCookies(res, tokens);

            res.json({
                message: "Tokens refreshed successfully",
                tokens,
            });
        });
    };

    logout = async (req, res) => {
        await this.handleRequest(req, res, async () => {
            await this.authService.logout(req.user.id);

            this.authService.clearCookies(res);

            res.json({
                message: "Logged out successfully",
            });
        });
    };
}
