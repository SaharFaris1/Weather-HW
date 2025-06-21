import { Request } from 'express';

interface AuthUser {
  userId: string;
  role?: 'user' | 'admin';
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}