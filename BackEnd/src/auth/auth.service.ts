import bcrypt from 'bcryptjs'; // Librería para comparar y encriptar contraseñas
import jwt from 'jsonwebtoken'; // Librería para generar y verificar tokens JWT
import { Alumno } from '../alumno/alumno.entity'; // Entidad Alumno para buscar usuarios alumnos
import { Admin } from '../admin/admin.entity'; // Entidad Admin para buscar usuarios administradores
import { orm } from '../shared/db/orm.js'; // ORM para interactuar con la base de datos

// Servicio de autenticación
export class AuthService {
  // Método para manejar el inicio de sesión
  public async login(usuario: string, contraseña: string): Promise<string> {
    const em = orm.em.fork(); // Crear un EntityManager para realizar consultas a la base de datos

    // Buscar al usuario en las tablas Alumno y Admin
    const alumno = await em.findOne(Alumno, { usuario }); // Buscar en la tabla Alumno
    const admin = await em.findOne(Admin, { usuario }); // Buscar en la tabla Admin

    // Si no se encuentra el usuario en ninguna tabla, lanzar un error
    const user = alumno || admin; // Si no es un Alumno, buscará en Admin
    if (!user) {
      throw new Error('Usuario no encontrado'); // Lanzar error si el usuario no existe
    }

    // Verificar si la contraseña ingresada coincide con el hash almacenado
    const isMatch = await bcrypt.compare(contraseña, user.password);
    if (!isMatch) {
      throw new Error('Contraseña incorrecta'); // Lanzar error si la contraseña no coincide
    }

    // Generar un token JWT con el ID y el rol del usuario
    const token = jwt.sign(
      {
        id: user.id, // ID del usuario
        rol: user instanceof Alumno ? 'alumno' : 'admin', // Determinar el rol según la instancia
      },
      process.env.JWT_SECRET as string, // Clave secreta para firmar el token (debe estar en una variable de entorno)
      { expiresIn: '1h' } // Configurar la expiración del token (1 hora)
    );

    return token; // Devolver el token generado
  }
}