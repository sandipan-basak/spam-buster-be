"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const search_1 = require("../controllers/search");
const authenticate_1 = require("../middleware/authenticate");
const router = express_1.default.Router();
router.post('/findByName', authenticate_1.authenticate, search_1.findByName); // Search by name
router.post('/findByNumber', authenticate_1.authenticate, search_1.findByNumber); // Search by number
router.get('/details/:belongsTo/:id', search_1.getPersonDetails); // Search a particular entity
exports.default = router;
