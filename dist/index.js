"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const races_1 = require("./routes/races");
const users_1 = require("./routes/users");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend Kalendar Utrka is running' });
});
// Races routes
app.use('/api/utrke', races_1.racesRouter);
app.use('/api/korisnici', users_1.usersRouter);
const db_1 = require("./db");
(0, db_1.connectDB)().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
//# sourceMappingURL=index.js.map