// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extiende la interfaz Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: any; // Define un tipo más específico si sabes cómo luce tu payload
    }
  }
}

export const verifyRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).send('Access token is required');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as any;

      if (!roles.includes(decoded.rol)) {
        return res.status(403).json({ message: `Access denied. Required roles: ${roles.join(', ')}` });
      }

      req.user = decoded; // Ahora `req.user` no generará errores
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
};
