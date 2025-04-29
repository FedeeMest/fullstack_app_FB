import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible en toda la aplicación
})
export class AuthStateService {
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn()); // Estado inicial basado en si el usuario está autenticado

  // Observable para que los componentes se suscriban
  authState$ = this.authState.asObservable();

  constructor() {}

  // Verificar si el usuario está autenticado
  private isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && localStorage) { // Verificar si estamos en el navegador
      return !!localStorage.getItem('token'); // Devuelve true si hay un token en el localStorage
    }
    return false; // Si no estamos en el navegador, asumimos que no está autenticado
  }

  // Actualizar el estado de autenticación
  setAuthState(isAuthenticated: boolean): void {
    this.authState.next(isAuthenticated); // Actualiza el estado de autenticación
  }
}