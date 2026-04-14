"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const auth_1 = require("./auth");
exports.usersRouter = (0, express_1.Router)();
// Registracija korisnika
exports.usersRouter.post('/register', async (req, res) => {
    try {
        const { username, password, name, surname, email, phone_number, role, birth_date, gender } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Korisničko ime, lozinka i email su obavezni' });
        }
        const korisnik = await (0, auth_1.registerUser)({ username, password, name, surname, email, phone_number, role, birth_date, gender });
        res.status(201).json(korisnik);
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Korisnik s tim emailom već postoji' });
        }
        console.error('Greška pri registraciji:', error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});
// Prijava korisnika
exports.usersRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email i lozinka su obavezni' });
        }
        const rezultat = await (0, auth_1.loginUser)(email, password);
        res.json(rezultat);
    }
    catch (error) {
        if (error.message === 'Neispravni podaci za prijavu') {
            return res.status(401).json({ message: error.message });
        }
        console.error('Greška pri prijavi:', error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});
// Promjena lozinke (zaštićena ruta)
exports.usersRouter.put('/promjena-lozinke', auth_1.verifyToken, async (req, res) => {
    try {
        const { email, novaLozinka } = req.body;
        if (!email || !novaLozinka) {
            return res.status(400).json({ message: 'Email i nova lozinka su obavezni' });
        }
        await (0, auth_1.changePassword)(email, novaLozinka);
        res.json({ message: 'Lozinka uspješno promijenjena' });
    }
    catch (error) {
        if (error.message === 'Korisnik nije pronađen') {
            return res.status(404).json({ message: error.message });
        }
        console.error('Greška pri promjeni lozinke:', error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});
//# sourceMappingURL=users.js.map