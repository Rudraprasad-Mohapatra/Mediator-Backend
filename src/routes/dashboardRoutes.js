import express from "express";
import { DashboardController } from "../controllers/DashboardController.js";
import { auth } from "../middleware/auth.js";
import { roleAuth } from "../middleware/roleAuth.js";

const router = express.Router();
const dashboardController = new DashboardController();

// Role-based dashboard routes
router.get(
    "/user",
    auth,
    roleAuth(["user"]),
    dashboardController.getUserDashboard
);

router.get(
    "/mediator",
    auth,
    roleAuth(["mediator"]),
    dashboardController.getMediatorDashboard
);

export default router;
