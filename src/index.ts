import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { racesRouter } from './routes/races';
import { usersRouter } from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Kalendar Utrka is running' });
});


// Races routes
app.use('/api/races', racesRouter);
app.use('/api/users', usersRouter);

import { connectDB } from './db';

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
