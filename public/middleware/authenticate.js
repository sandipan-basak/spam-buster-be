"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignup = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = require("../utils/validator");
if (typeof process.env.SECRET_KEY === 'undefined' || process.env.SECRET_KEY === '') {
    throw new Error('SECRET_KEY is not set.');
}
const secretKey = process.env.SECRET_KEY;
const authenticate = (req, res, next) => {
    const cookieHeader = req.headers.cookie;
    const cookies = {};
    cookieHeader === null || cookieHeader === void 0 ? void 0 : cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        cookies[name] = value;
    });
    const token = cookies.sid;
    if (token == null && token === '') {
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, user) => {
        if (err != null) {
            return res.sendStatus(403);
        }
        req.body.user = user;
        next();
    });
};
exports.authenticate = authenticate;
const validateSignup = (req, res, next) => {
    const { error } = validator_1.signupSchema.validate(req.body, { abortEarly: false });
    if (error != null) {
        return res.status(400).json({ errors: error.details });
    }
    next();
};
exports.validateSignup = validateSignup;
