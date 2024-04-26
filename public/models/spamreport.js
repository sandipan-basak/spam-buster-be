"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class SpamReport extends sequelize_1.Model {
}
SpamReport.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    marked_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    user_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    }
}, {
    sequelize: database_1.sequelize,
    modelName: 'SpamReport',
    timestamps: true,
    updatedAt: false,
    createdAt: 'marked_at'
});
exports.default = SpamReport;
