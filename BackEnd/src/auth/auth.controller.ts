import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js'; // Importa el ORM para interactuar con la base de datos
import { AuthService } from './auth.service.js';

const authService = new AuthService();

// Controlador para manejar el inicio de sesión
export const login = async (req: Request, res: Response) => {
  // Extraer las credenciales del cuerpo de la solicitud
  const { usuario, password } = req.body;
  
  // Log para depuración: mostrar la contraseña recibida
  console.log('Contraseña recibida:', password);

  try {
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