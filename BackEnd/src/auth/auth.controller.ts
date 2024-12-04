import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {

  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Endpoint para el login
  public login = async (req: Request, res: Response) => {
    const { usuario, contraseña } = req.body;

    try {
      const token = await this.authService.login(usuario, contraseña);
      res.json({ token });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
}
