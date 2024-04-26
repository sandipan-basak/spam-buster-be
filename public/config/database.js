"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("./config"));
function throwConfigError(field) {
    throw new Error(`${field} is not defined.`);
}
// Use a function to determine the environment, checking explicitly for undefined and empty strings
function getEnvironment(defaultEnv) {
    const env = process.env.NODE_ENV;
    if (env == null || env.trim() === '') {
        return defaultEnv;
    }
    return env;
}
const env = getEnvironment('development');
const config = config_1.default[env];
const username = (_a = config.username) !== null && _a !== void 0 ? _a : throwConfigError('DB_USERNAME');
const password = (_b = config.password) !== null && _b !== void 0 ? _b : throwConfigError('DB_PASSWORD');
const database = (_c = config.database) !== null && _c !== void 0 ? _c : throwConfigError('DB_NAME');
const host = (_d = config.host) !== null && _d !== void 0 ? _d : throwConfigError('DB_HOST');
exports.sequelize = new sequelize_1.Sequelize(database, username, password, {
    host,
    dialect: config.dialect,
    logging: config.logging
});
