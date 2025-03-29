import User from "../models/user.js";
import { NotFoundError } from "../utils/errors.js";

export class DashboardService {
    async getUserDashboardData(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            stats: {
                lastLogin: user.updatedAt,
                accountCreated: user.createdAt,
                status: user.status,
            },
            recentActivities: [], // Placeholder for future implementation
        };
    }

    async getMediatorDashboardData(mediatorId) {
        const mediator = await User.findByPk(mediatorId);
        if (!mediator) {
            throw new NotFoundError("Mediator not found");
        }

        return {
            mediator: {
                id: mediator.id,
                username: mediator.username,
                email: mediator.email,
                role: mediator.role,
            },
            stats: {
                lastLogin: mediator.updatedAt,
                accountCreated: mediator.createdAt,
                status: mediator.status,
            },
            activeClients: [], // Placeholder for future implementation
            recentCases: [], // Placeholder for future implementation
        };
    }
}
