import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js'; // Asegúrate de ajustar la ruta según tu estructura de proyecto
import { Admin } from '../admin/admin.entity.js'; // Asegúrate de ajustar la ruta según tu estructura de proyecto
import { Alumno } from '../alumno/alumno.entity.js'; // Asegúrate de ajustar la ruta según tu estructura de proyecto
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req: Request, res: Response) => {
  const { usuario, password } = req.body;
  const em = orm.em.fork(); // Crear una nueva instancia del EntityManager

  console.log('Contraseña recibida:', password);

  try {
    // Buscar el usuario en la tabla Admin
    let user = await em.findOne(Admin, { usuario });
    console.log('Buscando en Admin:', user);

    // Si no se encuentra en la tabla Admin, buscar en la tabla Alumno
    if (!user) {
      let user: Admin | Alumno | null = await em.findOne(Admin, { usuario });      console.log('Buscando en Alumno:', user);
    }

    // Si no se encuentra en ninguna tabla, devolver error
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('Contraseña almacenada (hash):', user.password);

    // Verificar la password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Verificando contraseña:', isMatch);

    if (!isMatch) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar el token JWT
    const token = jwt.sign({ id: user.id, rol: user.rol }, 'your_jwt_secret', { expiresIn: '1h' });

    // Enviar el token al cliente
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

