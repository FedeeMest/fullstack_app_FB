import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extiende la interfaz Request de Express para incluir la propiedad `user`
// Esto permite almacenar el payload decodificado del token JWT en `req.user`
declare global {
  namespace Express {
    interface Request {
      user?: any; // Define un tipo más específico si conoces la estructura del payload del token
    }
  }
}

// Middleware para verificar el rol del usuario
export const verifyRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Obtener el encabezado de autorización
    const authHeader = req.headers['authorization'];

    // Verificar si el encabezado de autorización está presente y tiene el formato correcto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).send('Access token is required'); // Devolver un error 403 si no hay token
    }

    // Extraer el token del encabezado
    const token = authHeader.split(' ')[1];

    try {
      // Verificar y decodificar el token JWT
      const decoded = jwt.verify(token, 'your_jwt_secret'); // Reemplaza 'your_jwt_secret' con tu clave secreta
      req.user = decoded; // Almacenar el payload decodificado en `req.user`

      // Verificar si el rol del usuario está incluido en los roles permitidos
      if (!roles.includes(req.user.rol)) {
        return res.status(403).send('Access denied'); // Devolver un error 403 si el rol no tiene acceso
      }

      // Si todo está bien, pasar al siguiente middleware o controlador
      next();
    } catch (err) {
      // Manejar errores de verificación del token
      return res.status(403).send('Invalid token'); // Devolver un error 403 si el token es inválido
    }
  };
};