"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.racesRouter = void 0;
const express_1 = require("express");
exports.racesRouter = (0, express_1.Router)();
// In-memory array for simple backend
let utrke = [
    { id: 1, naziv: 'Zagrebački maraton', datum: '2024-10-13', lokacija: 'Zagreb' },
    { id: 2, naziv: 'Splitski polumaraton', datum: '2024-02-25', lokacija: 'Split' },
];
exports.racesRouter.get('/', (req, res) => {
    res.json(utrke);
});
exports.racesRouter.get('/:id', (req, res) => {
    const utrka = utrke.find(u => u.id === parseInt(req.params.id));
    if (utrka) {
        res.json(utrka);
    }
    else {
        res.status(404).json({ message: 'Utrka nije pronađena' });
    }
});
exports.racesRouter.post('/', (req, res) => {
    const novaUtrka = {
        id: utrke.length ? Math.max(...utrke.map(u => u.id)) + 1 : 1,
        ...req.body
    };
    utrke.push(novaUtrka);
    res.status(201).json(novaUtrka);
});
exports.racesRouter.delete('/:id', (req, res) => {
    const index = utrke.findIndex(u => u.id === parseInt(req.params.id));
    if (index !== -1) {
        const obrisana = utrke.splice(index, 1);
        res.json(obrisana[0]);
    }
    else {
        res.status(404).json({ message: 'Utrka nije pronađena' });
    }
});
//# sourceMappingURL=races.js.map