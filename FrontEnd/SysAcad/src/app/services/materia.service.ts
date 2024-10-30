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
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
  
    if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Errores del lado del servidor
      if (error.status === 400) {
        if (error.error.error.includes('No se puede eliminar la materia porque tiene inscripciones asociadas')) {
          errorMessage = 'No se puede eliminar la materia porque tiene inscripciones asociadas.';
        } else {
          errorMessage = 'Solicitud inválida. Por favor, verifica los datos ingresados.';
        }
      } else if (error.status === 404) {
        errorMessage = 'La materia no fue encontrada.';
      } else if (error.status === 409) {
        errorMessage = 'Conflicto al procesar la solicitud. Intenta de nuevo.';
      } else {
        errorMessage = `Ocurrió un error inesperado: ${error.message}`;
      }
    }
  
    return throwError(() => new Error(errorMessage));
  }
  
  

  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.myAppUrl}${this.myApiUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  saveMateria(materia: Materia): Observable<Materia> {
    return this.http.post<Materia>(`${this.myAppUrl}${this.myApiUrl}`, materia).pipe(
      catchError(this.handleError)
    );
  }

  getMateria(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.myAppUrl}${this.myApiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateMateria(id: number, materia: Materia): Observable<Materia> {
    return this.http.put<Materia>(`${this.myAppUrl}${this.myApiUrl}/${id}`, materia).pipe(
      catchError(this.handleError)
    );
  }
}
