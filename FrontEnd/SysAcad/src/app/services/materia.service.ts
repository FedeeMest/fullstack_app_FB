import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.js';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Materia } from '../interfaces/materia.js';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/materias';
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

  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.myAppUrl}${this.myApiUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteMateria(id: number): Observable<void> {
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + "/" + id).pipe(
      catchError(this.handleError)
    );
  }

  saveMateria(materia: Materia): Observable<Materia> {
    return this.http.post<Materia>(`${this.myAppUrl}${this.myApiUrl}`, materia).pipe(
      catchError(this.handleError)
    );
  }

  getMateria(id: number): Observable<Materia> {
    return this.http.get<Materia>(this.myAppUrl + this.myApiUrl + "/" + id).pipe(
      catchError(this.handleError)
    );
  }

  updateMateria(id: number, materia: Materia): Observable<Materia> {
    return this.http.put<Materia>(`${this.myAppUrl}${this.myApiUrl}/${id}`, materia).pipe(
      catchError(this.handleError)
    );
  }
}
