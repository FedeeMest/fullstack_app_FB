import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usuario } from '../shared/usuario/usuario.entity';  // Ajusta la importación según la ubicación de tu clase Usuario

export class AuthService {

  // Lógica para el login (verificación del usuario y contraseña)
  public async login(usuario: string, contraseña: string): Promise<string> {
    // Aquí deberías buscar al usuario en la base de datos (lo haremos con un mock por ahora)
    const user = await usuario.findOne({ usuario }); // Busca al usuario por el nombre de usuario (ajusta la consulta a tu modelo)

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verifica la contraseña
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);

    if (!isMatch) {
      throw new Error('Contraseña incorrecta');
    }

    // Crea el token JWT
    const token = jwt.sign({ id: user.id, tipo_usuario: user.tipo_usuario }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    return token;
  }
}
