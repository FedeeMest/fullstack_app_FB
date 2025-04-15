import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());

  // Observable para que los componentes se suscriban
  authState$ = this.authState.asObservable();

  constructor() {}

  // Verificar si el usuario está autenticado
  private isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && localStorage) { // Verificar si estamos en el navegador
      return !!localStorage.getItem('token');
    }
    return false; // Si no estamos en el navegador, asumimos que no está autenticado
  }

  // Actualizar el estado de autenticación
  setAuthState(isAuthenticated: boolean): void {
    this.authState.next(isAuthenticated);
  }
}
