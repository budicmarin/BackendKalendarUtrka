"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.racesRouter = void 0;
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const db_1 = require("../db");
exports.racesRouter = (0, express_1.Router)();
// Dohvat svih utrka
exports.racesRouter.get('/', async (req, res) => {
    try {
        const db = (0, db_1.getDB)();
        const utrke = await db.collection('utrke').find().toArray();
        res.json(utrke);
    }
    catch (error) {
        console.error("Greška kod dohvata:", error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});
// Dohvat pojedinačne utrke
exports.racesRouter.get('/:id', async (req, res) => {
    try {
        const db = (0, db_1.getDB)();
        const id = req.params.id;
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Neispravan format ID-ja' });
        }
        const utrka = await db.collection('utrke').findOne({ _id: new mongodb_1.ObjectId(id) });
        if (utrka) {
            res.json(utrka);
        }
        else {
            res.status(404).json({ message: 'Utrka nije pronađena' });
        }
    }
    catch (error) {
        console.error("Greška kod dohvata po ID-ju:", error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});
// Dodavanje nove utrke
exports.racesRouter.post('/', async (req, res) => {
    try {
        const db = (0, db_1.getDB)();
        const result = await db.collection('utrke').insertOne(req.body);
        // Vraćamo novododanu utrku
        const novaUtrka = await db.collection('utrke').findOne({ _id: result.insertedId });
        res.status(201).json(novaUtrka);
    }
    catch (error) {
        console.error("Greška pri unosu:", error);
        res.status(500).json({ message: 'Greška pri spremanju utrke' });
    }
});
// Brisanje utrke
exports.racesRouter.delete('/:id', async (req, res) => {
    try {
        const db = (0, db_1.getDB)();
        const id = req.params.id;
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Neispravan format ID-ja' });
        }
        const utrkaBrisanje = await db.collection('utrke').findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!utrkaBrisanje) {
            return res.status(404).json({ message: 'Utrka nije pronađena' });
        }
        await db.collection('utrke').deleteOne({ _id: new mongodb_1.ObjectId(id) });
        res.json(utrkaBrisanje);
    }
    catch (error) {
        console.error("Greška pri brisanju:", error);
        res.status(500).json({ message: 'Greška pri brisanju' });
    }
});
//# sourceMappingURL=races.js.map