import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js'; // Importa el ORM para interactuar con la base de datos
import { Admin } from '../admin/admin.entity.js'; // Entidad Admin para buscar usuarios administradores
import { Alumno } from '../alumno/alumno.entity.js'; // Entidad Alumno para buscar usuarios alumnos
import jwt from 'jsonwebtoken'; // Librería para generar y verificar tokens JWT
import bcrypt from 'bcryptjs'; // Librería para comparar y encriptar contraseñas

// Controlador para manejar el inicio de sesión
export const login = async (req: Request, res: Response) => {
  // Extraer las credenciales del cuerpo de la solicitud
  const { usuario, password } = req.body;

  // Crear una nueva instancia del EntityManager para realizar consultas
  const em = orm.em.fork();

  // Log para depuración: mostrar la contraseña recibida
  console.log('Contraseña recibida:', password);

  try {
    // Buscar el usuario en la tabla Admin
    let user: Admin | Alumno | null = await em.findOne(Admin, { usuario });
    console.log('Buscando en Admin:', user);

    // Si no se encuentra en la tabla Admin, buscar en la tabla Alumno
    if (!user) {
      user = await em.findOne(Alumno, { usuario });
      console.log('Buscando en Alumno:', user);
    }

    // Si no se encuentra en ninguna tabla, devolver un error 401 (No autorizado)
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Log para depuración: mostrar la contraseña almacenada (hash)
    console.log('Contraseña almacenada (hash):', user.password);

    // Verificar si la contraseña ingresada coincide con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Verificando contraseña:', isMatch);

    // Si las contraseñas no coinciden, devolver un error 401 (Credenciales inválidas)
    if (!isMatch) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar un token JWT con el ID y el rol del usuario
    const token = jwt.sign(
      { id: user.id, rol: user.rol }, // Datos que se incluirán en el token
      'your_jwt_secret', // Clave secreta para firmar el token (debería estar en una variable de entorno)
      { expiresIn: '1h' } // El token expirará en 1 hora
    );

    // Enviar el token al cliente como respuesta
    res.json({ token });
  } catch (error) {
    // Manejar errores inesperados y devolver un error 500 (Error interno del servidor)
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};