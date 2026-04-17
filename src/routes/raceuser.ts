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

raceuserRouter.get('/:id', async (req, res) => {
    try {
        const db = getDB();
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Neispravan format ID-ja' });
        }
        const raceuser = await db.collection('raceuser').findOne({ _id: new ObjectId(id) });
        res.json(raceuser);
    } catch (error) {
        console.error("Greška kod dohvata:", error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});
raceuserRouter.get('/user/:id', async (req, res) => {
    try {
        const db = getDB();
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Neispravan format ID-ja' });
        }
        const raceuser = await db.collection('raceuser').find({ user_id: id }).toArray();
        res.json(raceuser);
    } catch (error) {
        console.error("Greška kod dohvata:", error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});
raceuserRouter.get('/race/:id', async (req, res) => {
    try {
        const db = getDB();
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Neispravan format ID-ja' });
        }
        const raceuser = await db.collection('raceuser').find({ race_id: id }).toArray();
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

// POST /api/raceuser/race/:raceId/register
raceuserRouter.post('/race/:raceId/register', async (req, res) => {
    try {
        const db = getDB()
        const { raceId } = req.params
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ message: 'userId je obavezan' })
        }

        const existing = await db.collection('raceuser').findOne({
            race_id: raceId,
            user_id: userId,
        })
        if (existing) {
            return res.status(409).json({ message: 'Već ste prijavljeni na ovu utrku' })
        }

        const result = await db.collection('raceuser').insertOne({
            race_id: raceId,
            user_id: userId,
            created_at: new Date(),
        })
        res.status(201).json(result)
    } catch (error) {
        console.error('Greška kod prijave:', error)
        res.status(500).json({ message: 'Greška na serveru' })
    }
})

// DELETE /api/raceuser/race/:raceId/register
raceuserRouter.delete('/race/:raceId/register', async (req, res) => {
    try {
        const db = getDB()
        const { raceId } = req.params
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ message: 'userId je obavezan' })
        }

        const result = await db.collection('raceuser').deleteOne({
            race_id: raceId,
            user_id: userId,
        })

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Prijava nije pronađena' })
        }

        res.json({ message: 'Uspješno odjavljen' })
    } catch (error) {
        console.error('Greška kod odjave:', error)
        res.status(500).json({ message: 'Greška na serveru' })
    }
})