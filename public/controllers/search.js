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
exports.getPersonDetails = exports.findByNumber = exports.findByName = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const spam_1 = __importDefault(require("../models/spam"));
const associations_1 = require("../models/associations");
const findByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const usersPromise = associations_1.User.findAll({
            where: {
                name: {
                    [sequelize_1.Op.iLike]: `%${name}%`
                }
            },
            attributes: ['id', 'name', 'phone_number'],
            order: [
                [database_1.sequelize.fn('position', database_1.sequelize.literal(`'${name}' IN name`)), 'ASC'],
                [database_1.sequelize.fn('length', database_1.sequelize.col('name')), 'ASC']
            ]
        });
        const contactsPromise = associations_1.Contact.findAll({
            where: {
                name: {
                    [sequelize_1.Op.iLike]: `%${name}%`
                }
            },
            attributes: ['id', 'name', 'phone_number'],
            include: [{
                    model: associations_1.User,
                    as: 'User',
                    attributes: ['id', 'name']
                }],
            order: [
                [database_1.sequelize.fn('position', database_1.sequelize.literal(`'${name}' IN "Contact"."name"`)), 'ASC'],
                [database_1.sequelize.fn('length', database_1.sequelize.col('"Contact"."name"')), 'ASC']
            ]
        });
        const [users, contacts] = yield Promise.all([usersPromise, contactsPromise]);
        let results = [
            ...users.map(user => (Object.assign(Object.assign({}, user.toJSON()), { belongsTo: 'user', type_id: user.id }))),
            ...contacts.map(contact => ({
                name: contact.name,
                phone_number: contact.phone_number,
                contact_of: contact.User.name,
                belongsTo: 'contact',
                type_id: contact.id
            }))
        ];
        results = yield Promise.all(results.map((result) => __awaiter(void 0, void 0, void 0, function* () {
            const spamReports = yield spam_1.default.count({
                where: { phone_number: result.phone_number }
            });
            const totalReports = yield spam_1.default.count();
            const spamLikelihood = totalReports > 0 ? (spamReports / totalReports) * 100 : 0;
            return {
                name: result.name,
                phone_number: result.phone_number,
                spam_likelihood: `${spamLikelihood.toFixed(2)}%`,
                belongsTo: result.belongsTo,
                type_id: result.type_id
            };
        })));
        res.json(results);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching for users', error: error.message });
    }
});
exports.findByName = findByName;
const findByNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.body;
    try {
        const user = yield associations_1.User.findOne({
            where: { phone_number: phoneNumber },
            attributes: ['id', 'name', 'phone_number']
        });
        if (user != null) {
            const spamReports = yield spam_1.default.count({
                where: { phone_number: phoneNumber }
            });
            const totalReports = yield spam_1.default.count();
            const spamLikelihood = totalReports > 0 ? (spamReports / totalReports) * 100 : 0;
            res.json({
                name: user.name,
                phone_number: user.phone_number,
                spam_likelihood: `${spamLikelihood.toFixed(2)}%`,
                belongsTo: 'user',
                type_id: user.id
            });
            return;
        }
        const contacts = yield associations_1.Contact.findAll({
            where: { phone_number: phoneNumber },
            attributes: ['id', 'name', 'phone_number'],
            include: [{
                    model: associations_1.User,
                    as: 'User',
                    attributes: ['id', 'name']
                }]
        });
        if (contacts.length === 0) {
            const spams = yield spam_1.default.findAll({
                where: { phone_number: phoneNumber },
                attributes: ['id', 'phone_number', 'report_count']
            });
            if (spams.length > 0) {
                const results = spams.map(spam => ({
                    phone_number: spam.phone_number,
                    report_count: spam.report_count,
                    spam_likelihood: '100%',
                    belongsTo: 'spam',
                    type_id: spam.id
                }));
                res.json(results);
                return;
            }
        }
        const results = yield Promise.all(contacts.map((contact) => __awaiter(void 0, void 0, void 0, function* () {
            const spamReports = yield spam_1.default.count({
                where: { phone_number: phoneNumber }
            });
            const totalReports = yield spam_1.default.count();
            const spamLikelihood = totalReports > 0 ? (spamReports / totalReports) * 100 : 0;
            return {
                name: contact.name,
                phone_number: contact.phone_number,
                contact_of: contact.User.name,
                spam_likelihood: `${spamLikelihood.toFixed(2)}%`,
                belongsTo: 'contact',
                type_id: contact.id
            };
        })));
        res.json(results);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching by phone number', error: error.message });
    }
});
exports.findByNumber = findByNumber;
const getPersonDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, belongsTo } = req.params;
    try {
        let entity;
        if (belongsTo === 'user') {
            entity = yield associations_1.User.findByPk(id);
        }
        else if (belongsTo === 'contact') {
            entity = yield associations_1.Contact.findByPk(id, { include: [{ model: associations_1.User, as: 'User' }] });
        }
        else if (belongsTo === 'spam') {
            entity = yield spam_1.default.findByPk(id);
        }
        if (entity == null) {
            res.status(404).json({ message: 'Entity not found.' });
        }
        res.json(entity);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving details', error: error.message });
    }
});
exports.getPersonDetails = getPersonDetails;
