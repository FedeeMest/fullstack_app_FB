import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development'; // Importa las variables de entorno
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Módulos para realizar solicitudes HTTP y manejar errores
import { Observable, throwError } from 'rxjs'; // Manejo de observables y errores
import { catchError } from 'rxjs/operators'; // Operador para manejar errores en las solicitudes HTTP
import { Admin } from '../interfaces/admin.js'; // Interfaz para el modelo de administrador


@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible en toda la aplicación
})
export class AdminService {
  private myAppUrl: string; // URL base de la aplicación
  private myApiUrl: string; // URL específica para la API de administradores

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint; // Asigna la URL base desde las variables de entorno
    this.myApiUrl = '/api/admins'; // Define la ruta específica para los administradores
  }

  // Manejo de errores en las solicitudes HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido'; // Mensaje de error por defecto

    if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Errores del lado del servidor
      if (error.status === 400) {
        errorMessage = 'Solicitud inválida. Por favor, verifica los datos ingresados.';
      } else if (error.status === 404) {
        errorMessage = 'El administrador no fue encontrado.'; // Error 404: No encontrado
      } else if (error.status === 409) {
        errorMessage = 'Conflicto al procesar la solicitud. Intenta de nuevo.';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
      } else {
        errorMessage = `Ocurrió un error inesperado: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage)); // Lanza un error con el mensaje correspondiente
  }

  // Método para obtener todos los administradores
  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.myAppUrl + this.myApiUrl).pipe(
      catchError(this.handleError.bind(this)) // Maneja errores en la solicitud
    );
  }

  // Método para eliminar un administrador por su ID
  deleteAdmin(id: number): Observable<void> {
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + "/" + id).pipe(
      catchError(this.handleError.bind(this)) // Maneja errores en la solicitud
    );
  }

  // Método para guardar un nuevo administrador
  saveAdmin(admin: Admin): Observable<Admin> {
    return this.http.post<Admin>(this.myAppUrl + this.myApiUrl, admin).pipe(
      catchError(this.handleError.bind(this)) // Maneja errores en la solicitud
    );
  }

  // Método para actualizar un administrador existente
  updateAdmin(id: number, admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(this.myAppUrl + this.myApiUrl + "/" + id, admin).pipe(
      catchError(this.handleError.bind(this)) // Maneja errores en la solicitud
    );
  }

  // Método para obtener un administrador por su ID
  getAdmin(id: number): Observable<Admin> {
    return this.http.get<Admin>(this.myAppUrl + this.myApiUrl + "/" + id).pipe(
      catchError(this.handleError.bind(this)) // Maneja errores en la solicitud
    );
  }
}