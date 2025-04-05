// src/config/db.js
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

// Load environment variables first
dotenv.config();

console.log("📦 DB Connection Config:");
console.log(`  Host:     ${process.env.DB_HOST}`);
console.log(`  Port:     ${process.env.DB_PORT}`);
console.log(`  Name:     ${process.env.DB_NAME}`);
console.log(`  User:     ${process.env.DB_USER}`);
console.log(
    `  Password: ${process.env.DB_PASSWORD ? "[HIDDEN]" : "❌ Not Set"}`
);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: console.log, // Enable logging to see connection issues
        port: process.env.DB_PORT,
        retry: {
            max: 10,
            match: [
                /SequelizeConnectionError/,
                /SequelizeConnectionRefusedError/,
                /SequelizeHostNotFoundError/,
                /SequelizeHostNotReachableError/,
                /SequelizeInvalidConnectionError/,
                /SequelizeConnectionTimedOutError/,
                /TimeoutError/,
            ],
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

export default sequelize;
