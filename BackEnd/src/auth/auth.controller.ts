import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js'; // Importa el ORM para interactuar con la base de datos
import { Admin } from '../admin/admin.entity.js'; // Entidad Admin para buscar usuarios administradores
import { Alumno } from '../alumno/alumno.entity.js'; // Entidad Alumno para buscar usuarios alumnos
import jwt from 'jsonwebtoken'; // Librería para generar y verificar tokens JWT
import bcrypt from 'bcryptjs'; // Librería para comparar y encriptar contraseñas
import { AuthService } from './auth.service.js';

const authService = new AuthService();

// Controlador para manejar el inicio de sesión
export const login = async (req: Request, res: Response) => {
  // Extraer las credenciales del cuerpo de la solicitud
  const { usuario, password } = req.body;
  try {
    // Delegar la lógica de autenticación al servicio
    const token = await authService.login(usuario, password);

    // Enviar el token al cliente como respuesta
    res.json({ token });
  } catch (error) {
    console.error(error);

    // Manejar errores específicos
    if (error instanceof Error && (error.message === 'Usuario no encontrado' || error.message === 'Contraseña incorrecta')) {
      return res.status(401).json({ error: error.message });
    }

    // Manejar errores inesperados
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};