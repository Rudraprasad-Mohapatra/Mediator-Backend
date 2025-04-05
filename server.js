// server.js
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import sequelize from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import publicRoutes from "./src/routes/publicRoutes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
// app.use('/api/protected', protectedRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Mediator Application",
        features: [
            "Connect with verified mediators",
            "Secure chat system",
            "Case management",
            "Real-time updates",
        ],
        status: "online",
        version: "1.0.0",
    });
});

// Database connection and server startup
const startServer = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log("Database connection has been established successfully.");

        // Sync database (create tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log("Database synchronized");

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

startServer();
