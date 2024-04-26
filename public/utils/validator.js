"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signupSchema = joi_1.default.object({
    username: joi_1.default.string().min(4).required().messages({
        'string.base': 'Username should be a type of \'text\'',
        'string.empty': 'Username cannot be an empty field',
        'string.min': 'Username should have a minimum length of {#limit}',
        'any.required': 'Username is a required field'
    }),
    email: joi_1.default.string().email().optional().allow(null, '').messages({
        'string.email': 'Email must be a valid email address'
    }),
    phone_number: joi_1.default.string().optional().allow(null, '').messages({
        'string.base': 'Phone number must be a valid phone number'
    }),
    password: joi_1.default.string().required().messages({
        'string.base': 'Password should be a type of \'text\'',
        'string.empty': 'Password cannot be an empty field',
        'any.required': 'Password is a required field'
    })
});
