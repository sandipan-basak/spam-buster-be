"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Spam extends sequelize_1.Model {
}
Spam.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: ''
    },
    report_count: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    first_reported_by_user_id: {
        type: sequelize_1.DataTypes.BIGINT,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    name: {
        type: sequelize_1.DataTypes.TEXT
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: database_1.sequelize,
    modelName: 'Spam',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
exports.default = Spam;
