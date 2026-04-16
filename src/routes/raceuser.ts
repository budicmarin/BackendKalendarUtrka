import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../db';

export const raceuserRouter = Router();

raceuserRouter.post('/', async (req, res) => {
    try {
        const db = getDB();
        const { race_id, user_id } = req.body;
        const raceuser = await db.collection('raceuser').insertOne({ race_id, user_id });
        res.status(201).json(raceuser);
    } catch (error) {
        console.error("Greška kod dohvata:", error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});

raceuserRouter.get('/', async (req, res) => {
    try {
        const db = getDB();
        const raceuser = await db.collection('raceuser').find().toArray();
        res.json(raceuser);
    } catch (error) {
        console.error("Greška kod dohvata:", error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});

raceuserRouter.delete('/:id', async (req, res) => {
    try {
        const db = getDB();
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Neispravan format ID-ja' });
        }
        const raceuser = await db.collection('raceuser').deleteOne({ _id: new ObjectId(id) });
        res.json(raceuser);
    } catch (error) {
        console.error("Greška kod dohvata:", error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});

