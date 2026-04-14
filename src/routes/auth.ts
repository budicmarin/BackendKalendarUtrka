import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string;
}

declare module 'express' {
    export interface Request {
        user?: JwtPayload;
    }
}

export interface UserData {
    username: string;
    password: string;
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    role?: string;
    birth_date?: string;
    gender?: string;
}

// Registracija novog korisnika
export async function registerUser(userData: UserData) {
    const db = getDB();
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const noviKorisnik = {
        _id: new ObjectId(),
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
export async function loginUser(email: string, password: string) {
    const db = getDB();

    const korisnik = await db.collection('users').findOne({ email });
    if (!korisnik) {
        throw new Error('Neispravni podaci za prijavu');
    }

    const lozinkaIspravna = await bcrypt.compare(password, korisnik.password as string);
    if (!lozinkaIspravna) {
        throw new Error('Neispravni podaci za prijavu');
    }

    const token = jwt.sign(
        { id: korisnik._id.toString() },
        process.env.JWT_SECRET ?? 'default_secret',
        { algorithm: 'HS256', expiresIn: '7d' }
    );

    return { token, email: korisnik.email };
}

// Promjena lozinke
export async function changePassword(email: string, novaLozinka: string) {
    const db = getDB();

    const korisnik = await db.collection('users').findOne({ email });
    if (!korisnik) {
        throw new Error('Korisnik nije pronađen');
    }

    const hashiranaLozinka = await bcrypt.hash(novaLozinka, 10);
    await db.collection('users').updateOne(
        { email },
        { $set: { password: hashiranaLozinka } }
    );
}

// Middleware za provjeru JWT tokena
export function verifyToken(req: Request, res: Response, next: NextFunction): Response | void {
    try {
        const authorization = req.headers.authorization?.split(' ');
        if (!authorization) {
            return res.status(401).json({ message: 'Nedostaje autorizacijski token' });
        }

        const [type, token] = authorization;
        if (type !== 'Bearer') {
            return res.status(401).json({ message: 'Neispravan tip tokena' });
        }

        req.user = jwt.verify(
            token,
            process.env.JWT_SECRET ?? 'default_secret'
        ) as JwtPayload;

        return next();
    } catch (e) {
        return res.status(403).json({ message: 'Nevažeći ili istekli token' });
    }
}