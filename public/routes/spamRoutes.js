"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const spamCRUD_1 = require("../controllers/spamCRUD");
const authenticate_1 = require("../middleware/authenticate");
const router = express_1.default.Router();
router.post('/markNumber', authenticate_1.authenticate, spamCRUD_1.reportSpam); // Mark a user sapm
router.post('/removeSpamVote', authenticate_1.authenticate, spamCRUD_1.removeSpamVote); // Mark a user sapm
exports.default = router;
