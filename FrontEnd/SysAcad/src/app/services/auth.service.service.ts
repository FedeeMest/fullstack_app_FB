import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // URL del backend
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private authStateService: AuthStateService) {}

  login(usuario: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { usuario, password });
  }

  logout(): void {
    localStorage.removeItem('token'); // Eliminar el token
    this.authStateService.setAuthState(false); // Notificar que el usuario cerró sesión
  }

  notifyLogin(): void {
    this.authStateService.setAuthState(true); // Notificar que el usuario inició sesión
  }

  getRole(): string | null {
    if (typeof window !== 'undefined' && localStorage) { // Verificar si localStorage está disponible
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken.rol;
      }
    }
    return null;
  }
  getUserId(): number | null {
    if (typeof window !== 'undefined' && localStorage) { // Verificar si localStorage está disponible
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken.id; 
      }
    }
    return null;
  }
}