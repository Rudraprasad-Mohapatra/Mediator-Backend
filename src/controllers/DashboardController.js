import { BaseController } from './BaseController.js';
import { DashboardService } from '../services/DashboardService.js';

export class DashboardController extends BaseController {
    constructor() {
        super();
        this.dashboardService = new DashboardService();
    }

    getUserDashboard = async (req, res) => {
        await this.handleRequest(req, res, async () => {
            const dashboardData = await this.dashboardService.getUserDashboardData(req.user.id);
            res.json(dashboardData);
        });
    }

    getMediatorDashboard = async (req, res) => {
        await this.handleRequest(req, res, async () => {
            const dashboardData = await this.dashboardService.getMediatorDashboardData(req.user.id);
            res.json(dashboardData);
        });
    }
}