// src/models/User.js
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";

class User extends Model {
    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password) {
        return await bcrypt.compare(password, this.password);
    }

    static async findByEmail(email) {
        return await this.findOne({ where: { email } });
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("user", "mediator", "admin"),
            defaultValue: "user",
        },
        status: {
            type: DataTypes.ENUM("active", "inactive", "suspended"),
            defaultValue: "active",
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        passwordResetToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        passwordResetExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "User",
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                user.password = await User.hashPassword(user.password);
            },
        },
    }
);

export default User;
