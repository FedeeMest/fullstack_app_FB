import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Materia } from '../interfaces/materia.js';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible en toda la aplicación
})
export class MateriaService {
  private myAppUrl: string; // URL base de la aplicación
  private myApiUrl: string; // URL específica para la API de materias

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint; // Asigna la URL base desde las variables de entorno
    this.myApiUrl = '/api/materias'; // Define la ruta específica para las materias
  }

  // Manejo de errores centralizado
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.status === 0) {
      errorMessage = `Error de red: ${error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error?.mensaje || 'Solicitud inválida. Por favor, verifica los datos ingresados.';
          break;
        case 404:
          errorMessage = 'La materia no fue encontrada.';
          break;
        case 409:
          errorMessage = 'Conflicto al procesar la solicitud. Intenta de nuevo.';
          break;
        default:
          errorMessage = `Ocurrió un error inesperado: ${error.message}`;
          break;
      }
    }
    // Lanzar un error para que pueda ser manejado en el componente
    return throwError(() => new Error(errorMessage));
  }

  // Método para obtener todas las materias
  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.myAppUrl}${this.myApiUrl}`).pipe(
      catchError(this.handleError) // Maneja errores en la solicitud
    );
  }

  // Método para eliminar una materia por su ID
  deleteMateria(id: number): Observable<void> {
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + "/" + id).pipe(
      catchError(this.handleError) // Maneja errores en la solicitud
    );
  }

  // Método para guardar una nueva materia
  saveMateria(materia: Materia): Observable<Materia> {
    return this.http.post<Materia>(`${this.myAppUrl}${this.myApiUrl}`, materia).pipe(
      catchError(this.handleError) // Maneja errores en la solicitud
    );
  }

  // Método para obtener una materia por su ID
  getMateria(id: number): Observable<Materia> {
    return this.http.get<Materia>(this.myAppUrl + this.myApiUrl + "/" + id).pipe(
      catchError(this.handleError) // Maneja errores en la solicitud
    );
  }

  // Método para actualizar una materia existente
  updateMateria(id: number, materia: Materia): Observable<Materia> {
    return this.http.put<Materia>(`${this.myAppUrl}${this.myApiUrl}/${id}`, materia).pipe(
      catchError(this.handleError) // Maneja errores en la solicitud
    );
  }
}