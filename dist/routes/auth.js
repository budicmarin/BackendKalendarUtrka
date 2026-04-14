"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.changePassword = changePassword;
exports.verifyToken = verifyToken;
const mongodb_1 = require("mongodb");
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Registracija novog korisnika
async function registerUser(userData) {
    const db = (0, db_1.getDB)();
    const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
    const noviKorisnik = {
        _id: new mongodb_1.ObjectId(),
        username: userData.username,
        password: hashedPassword,
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        phone_number: userData.phone_number,
        role: userData.role ?? 'korisnik',
        birth_date: userData.birth_date ? new Date(userData.birth_date) : null,
        gender: userData.gender,
        created_at: new Date(),
    };
    await db.collection('users').insertOne(noviKorisnik);
    const { password: _, ...korisnikBezLozinke } = noviKorisnik;
    return korisnikBezLozinke;
}
// Prijava korisnika — vraća JWT token
async function loginUser(email, password) {
    const db = (0, db_1.getDB)();
    const korisnik = await db.collection('users').findOne({ email });
    if (!korisnik) {
        throw new Error('Neispravni podaci za prijavu');
    }
    const lozinkaIspravna = await bcrypt_1.default.compare(password, korisnik.password);
    if (!lozinkaIspravna) {
        throw new Error('Neispravni podaci za prijavu');
    }
    const token = jsonwebtoken_1.default.sign({ id: korisnik._id.toString() }, process.env.JWT_SECRET ?? 'default_secret', { algorithm: 'HS256', expiresIn: '7d' });
    return { token, email: korisnik.email };
}
// Promjena lozinke
async function changePassword(email, novaLozinka) {
    const db = (0, db_1.getDB)();
    const korisnik = await db.collection('users').findOne({ email });
    if (!korisnik) {
        throw new Error('Korisnik nije pronađen');
    }
    const hashiranaLozinka = await bcrypt_1.default.hash(novaLozinka, 10);
    await db.collection('users').updateOne({ email }, { $set: { password: hashiranaLozinka } });
}
// Middleware za provjeru JWT tokena
function verifyToken(req, res, next) {
    try {
        const authorization = req.headers.authorization?.split(' ');
        if (!authorization) {
            return res.status(401).json({ message: 'Nedostaje autorizacijski token' });
        }
        const [type, token] = authorization;
        if (type !== 'Bearer' || !token) {
            return res.status(401).json({ message: 'Neispravan tip tokena' });
        }
        req.user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET ?? 'default_secret');
        return next();
    }
    catch (e) {
        return res.status(403).json({ message: 'Nevažeći ili istekli token' });
    }
}
//# sourceMappingURL=auth.js.map