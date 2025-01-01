import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET } = process.env;

export function authToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token == null) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET as string, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });

    req.user = user as string | JwtPayload;
    next();
  });
}
