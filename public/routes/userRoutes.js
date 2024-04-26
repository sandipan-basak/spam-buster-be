"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userCRUD_1 = require("../controllers/userCRUD");
const authenticate_1 = require("../middleware/authenticate");
const router = express_1.default.Router();
router.post('/create', userCRUD_1.createUser); // Create a new user
router.post('/logout', authenticate_1.authenticate, userCRUD_1.logOutUser); // Logout a user
router.post('/update', authenticate_1.authenticate, userCRUD_1.updateUser); // Update a user
router.post('/login', userCRUD_1.loginUser); // Login a user
router.delete('/:id', authenticate_1.authenticate, userCRUD_1.deleteUser); // Delete a user
exports.default = router;
