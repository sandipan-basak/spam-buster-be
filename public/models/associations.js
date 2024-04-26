"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spam = exports.Contact = exports.User = void 0;
const user_1 = __importDefault(require("../models/user"));
exports.User = user_1.default;
const contact_1 = __importDefault(require("../models/contact"));
exports.Contact = contact_1.default;
const spam_1 = __importDefault(require("../models/spam"));
exports.Spam = spam_1.default;
user_1.default.hasMany(contact_1.default, {
    foreignKey: 'user_id',
    as: 'contacts'
});
contact_1.default.belongsTo(user_1.default, {
    foreignKey: 'user_id',
    as: 'User'
});
