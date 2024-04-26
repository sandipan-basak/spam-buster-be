"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.deleteUser = exports.updateUser = exports.logOutUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, phoneNumber, password } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield user_1.default.create({
            name,
            email: email !== null && email !== void 0 ? email : null,
            phone_number: phoneNumber,
            pw_hash: hashedPassword
        });
        // Create a JWT token
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, name: newUser.name, email: newUser.email }, (_a = process.env.SECRET_KEY) !== null && _a !== void 0 ? _a : 'secret_key', { expiresIn: '7d' });
        // Set a cookie with the JWT
        res.cookie('sid', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phoneNumber: newUser.phone_number
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});
exports.createUser = createUser;
const logOutUser = (req, res, next) => {
    try {
        res.cookie('sid', '', { expires: new Date(0) });
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.logOutUser = logOutUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, name, email, password } = req.body;
    try {
        console.log('user details: ', user);
        const userToUpdate = yield user_1.default.findByPk(user.id);
        if (userToUpdate == null) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        if (password != null) {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            userToUpdate.pw_hash = hashedPassword;
        }
        userToUpdate.name = name !== null && name !== void 0 ? name : userToUpdate.name;
        userToUpdate.email = email !== null && email !== void 0 ? email : userToUpdate.email;
        console.log('new name and email: ', userToUpdate.name, userToUpdate.email);
        // not allowing phone_number change
        // userToUpdate.phone_number = phoneNumber ?? userToUpdate.phone_number;
        yield userToUpdate.save();
        res.status(200).json({
            id: userToUpdate.id,
            name: userToUpdate.name,
            email: userToUpdate.email,
            phoneNumber: userToUpdate.phone_number
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const userToDelete = yield user_1.default.findByPk(userId);
        if (userToDelete == null) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        yield userToDelete.destroy();
        res.status(200).json({ message: 'User deleted successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});
exports.deleteUser = deleteUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { password, phoneNumber } = req.body;
    try {
        let user = null;
        user = yield user_1.default.findOne({ where: { phone_number: phoneNumber } });
        if (user == null) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.pw_hash);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, (_b = process.env.SECRET_KEY) !== null && _b !== void 0 ? _b : 'default_secret_key', { expiresIn: '1h' });
        res.cookie('sid', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict'
        });
        res.status(200).json({
            message: 'Logged in successfully.',
            token,
            userId: user.id,
            name: user.name,
            email: user.email
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});
exports.loginUser = loginUser;
