import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../AuthRequest';

  // انشاء طلب 
  export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
  
    // يتحقق من وجوده ويبدا ب Bearer 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No Token' });
      return;
    }
  // عشان يستخرج التوكن بس
    const token = authHeader.split(' ')[1];
  
    try {
          // التحقق من التوكن باستخدام JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      req.user = 
      { userId: decoded.userId 
        
      };
      next();  // السماح للانتقال للدالة الي بعدها
    } catch (err) {
      res.status(401).json
      ({
         error: 'Invalid token' 
        });
    }
  };