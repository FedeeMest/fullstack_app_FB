// controllers/authController.ts
import { Request, Response } from 'express';
import { orm } from '../shared/db/orm'; // Asegúrate de ajustar la ruta según tu estructura de proyecto
import { Usuario } from '../shared/usuario/usuario.entity'; // Asegúrate de ajustar la ruta según tu estructura de proyecto
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { usuario, contraseña } = req.body;
  const em = orm.em.fork(); // Crear una nueva instancia del EntityManager

  try {
    // Buscar el usuario en la base de datos
    const user = await em.findOne(Usuario, { usuario, contraseña });

    if (!user) {
      return res.status(401).send('Invalid credentials');
    }

    // Generar el token JWT
    const token = jwt.sign({ id: user.id, rol: user.rol }, 'your_jwt_secret', { expiresIn: '1h' });

    // Enviar el token al cliente
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};