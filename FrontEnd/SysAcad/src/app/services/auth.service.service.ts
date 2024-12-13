import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private role: string | null = null;

  // Simula inicio de sesión
  login(usuario: string, contraseña: string): boolean {
    // Simular autenticación real
    if (usuario === 'admin_user') {
      this.role = 'admin';
    } else if (usuario === 'alumno_user') {
      this.role = 'alumno';
    } else {
      return false;
    }
    return true;
  }

  getRole(): string | null {
    return this.role;
  }
}