"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/first */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const spamRoutes_1 = __importDefault(require("./routes/spamRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
// Server started
app.get('/', (_, res) => {
    res.send('Backend server running!!');
});
app.use('/user', userRoutes_1.default);
app.use('/spam', spamRoutes_1.default);
app.use('/search', searchRoutes_1.default);
app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
});
exports.default = app;
