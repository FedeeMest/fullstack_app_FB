import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import jwt from 'jsonwebtoken';
import { Usuario } from '../shared/usuario/usuario.entity.js';

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
  return async (req: Request, res: Response, next: NextFunction) => {
    // Obtener el encabezado de autorización
    const em = orm.em.fork(); // Crear un EntityManager para la consulta
    const authHeader = req.headers['authorization'];

    // Verificar si el encabezado de autorización está presente y tiene el formato correcto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).send('Access token is required'); // Devolver un error 403 si no hay token
    }

    // Extraer el token del encabezado
    const token = authHeader.split(' ')[1];

    try {
      // Verificar y decodificar el token JWT
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number; rol: string };
      const userId = decoded.id;
      const userRole = decoded.rol;

      // Validar el usuario en la base de datos
      const usuario = await em.findOne(Usuario, { id: userId });
      if (!usuario || usuario.rol !== userRole || !roles.includes(usuario.rol)) {
        return res.status(403).send('Access denied'); // Rechazar si el usuario no existe o el rol no coincide
      }

      // Si todo está bien, pasar al siguiente middleware o controlador
      next();
    } catch (err) {
      // Manejar errores de verificación del token
      return res.status(403).send('Invalid token'); // Devolver un error 403 si el token es inválido
    }
  };
};