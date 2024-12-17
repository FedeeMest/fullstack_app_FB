import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Alumno } from '../alumno/alumno.entity';
import { Admin } from '../admin/admin.entity';
import { orm } from '../shared/db/orm.js';

export class AuthService {
  public async login(usuario: string, contraseña: string): Promise<string> {
    const em = orm.em.fork(); // Usar un EntityManager para trabajar con la base de datos

    // Buscar tanto en Alumno como en Admin usando el EntityManager
    const alumno = await em.findOne(Alumno, { usuario });
    const admin = await em.findOne(Admin, { usuario });

    // Si no se encuentra el usuario, lanzamos un error
    const user = alumno || admin; // Si no es un Alumno, buscará en Admin

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(contraseña, user.password);

    if (!isMatch) {
      throw new Error('Contraseña incorrecta');
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user.id, tipo_usuario: user instanceof Alumno ? 'alumno' : 'admin' },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' } // El token expirará en 1 hora
    );

    return token;
  }
}
