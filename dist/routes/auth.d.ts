import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
interface JwtPayload {
    id: string;
}
declare module 'express' {
    interface Request {
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
export declare function registerUser(userData: UserData): Promise<{
    _id: ObjectId;
    username: string;
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    role: string;
    birth_date: Date | null;
    gender: string | undefined;
    created_at: Date;
}>;
export declare function loginUser(email: string, password: string): Promise<{
    token: string;
    email: any;
}>;
export declare function changePassword(email: string, novaLozinka: string): Promise<void>;
export declare function verifyToken(req: Request, res: Response, next: NextFunction): Response | void;
export {};
//# sourceMappingURL=auth.d.ts.map