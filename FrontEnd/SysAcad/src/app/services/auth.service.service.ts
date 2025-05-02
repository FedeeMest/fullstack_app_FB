import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'; // Servicio para manejar y decodificar tokens JWT
import { AuthStateService } from './auth-state.service'; // Servicio para manejar el estado de autenticación
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible en toda la aplicación
})
export class AuthService {
  private apiUrl = environment.endpoint; // URL del backend para autenticación
  private jwtHelper = new JwtHelperService(); // Instancia del servicio para manejar tokens JWT

  constructor(private http: HttpClient, private authStateService: AuthStateService) {}

  // Método para iniciar sesión
  login(usuario: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, { usuario, password });
    // Realiza una solicitud POST al endpoint de login con las credenciales del usuario
    // Devuelve un observable con el token de autenticación
  }

  // Método para cerrar sesión
  logout(): void {
    sessionStorage.removeItem('token'); // Elimina el token del almacenamiento local
    this.authStateService.setAuthState(false); // Notifica que el usuario cerró sesión
  }

  // Método para notificar que el usuario inició sesión
  notifyLogin(): void {
    this.authStateService.setAuthState(true); // Actualiza el estado de autenticación a "true"
  }

  // Método para obtener el rol del usuario
  getRole(): string | null {
    if (typeof window !== 'undefined' && sessionStorage) { // Verifica si localStorage está disponible
      const token = sessionStorage.getItem('token'); // Obtiene el token del almacenamiento local
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token); // Decodifica el token JWT
        return decodedToken.rol; // Devuelve el rol del usuario
      }
    }
    return null; // Devuelve null si no hay token o no se puede obtener el rol
  }

  // Método para obtener el ID del usuario
  getUserId(): number | null {
    if (typeof window !== 'undefined' && sessionStorage) { // Verifica si localStorage está disponible
      const token = sessionStorage.getItem('token'); // Obtiene el token del almacenamiento local
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token); // Decodifica el token JWT
        return decodedToken.id; // Devuelve el ID del usuario
      }
    }
    return null; // Devuelve null si no hay token o no se puede obtener el ID
  }
}