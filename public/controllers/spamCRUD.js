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
exports.removeSpamVote = exports.reportSpam = void 0;
const spam_1 = __importDefault(require("../models/spam"));
const spamreport_1 = __importDefault(require("../models/spamreport"));
const database_1 = require("../config/database");
const reportSpam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { phoneNumber, user } = req.body;
    try {
        const spamReportRecord = yield spamreport_1.default.findOne({
            where: {
                phone_number: phoneNumber,
                user_id: user.id
            }
        });
        if (spamReportRecord != null) {
            res.status(409).json({ message: 'You have already reported this number as spam.' });
            return;
        }
        let spamRecord = yield spam_1.default.findOne({ where: { phone_number: phoneNumber } });
        if (spamRecord != null) {
            spamRecord.report_count = ((_a = spamRecord.report_count) !== null && _a !== void 0 ? _a : 0) + 1;
            yield spamRecord.save();
        }
        else {
            spamRecord = yield spam_1.default.create({
                phone_number: phoneNumber,
                report_count: 1,
                first_reported_by_user_id: user.id
            });
        }
        yield spamreport_1.default.create({
            phone_number: phoneNumber,
            user_id: user.id
        });
        res.status(200).json({ message: 'Reported successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error reporting spam', error: error.message });
    }
});
exports.reportSpam = reportSpam;
const removeSpamVote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { phoneNumber, user } = req.body;
    try {
        const transaction = yield database_1.sequelize.transaction();
        const spamRecord = yield spam_1.default.findOne({ where: { phone_number: phoneNumber } });
        if (spamRecord != null) {
            spamRecord.report_count = ((_b = spamRecord.report_count) !== null && _b !== void 0 ? _b : 0);
            spamRecord.report_count -= spamRecord.report_count === 0 ? 0 : 1;
            const spamReport = yield spamreport_1.default.findOne({
                where: {
                    phone_number: phoneNumber,
                    user_id: user.id
                }
            });
            if (spamReport != null) {
                yield Promise.all([
                    spamReport.destroy(),
                    spamRecord.save()
                ]);
                yield transaction.commit();
                res.status(200).json({ message: 'Removed spam vote' });
            }
            else {
                yield transaction.rollback();
                res.status(404).json({ message: 'Seems that your spam record was not found' });
            }
        }
        else {
            res.status(404).json({ message: 'Spam not found.' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error reporting spam', error: error.message });
    }
});
exports.removeSpamVote = removeSpamVote;
