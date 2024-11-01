import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Alumno } from '../interfaces/alumno';
import { Inscripcion } from '../interfaces/inscripcion';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/alumnos';
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Errores del lado del servidor
      if (error.status === 400) {
        errorMessage = 'Solicitud inválida. Por favor, verifica los datos ingresados.';
      } else if (error.status === 404) {
        errorMessage = 'El alumno no fue encontrado.';
      } else if (error.status === 409) {
        errorMessage = 'Conflicto al procesar la solicitud. Intenta de nuevo.';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
      } else {
        errorMessage = `Ocurrió un error inesperado: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.myAppUrl + this.myApiUrl).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteAlumno(id: number): Observable<void> {
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + "/" + id).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  saveAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(this.myAppUrl + this.myApiUrl, alumno).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getAlumno(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(this.myAppUrl + this.myApiUrl + "/" + id).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  updateAlumno(id: number, alumno: Alumno): Observable<Alumno> {
    return this.http.put<Alumno>(this.myAppUrl + this.myApiUrl + "/" + id, alumno).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getAlumnoByLegajo(legajo: number): Observable<Alumno | null> {
    console.log('Llamando a la API para buscar alumno con legajo:', legajo);
    return this.http.get<Alumno>(this.myAppUrl + this.myApiUrl + "/" + "legajo" + "/" + legajo).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getInscripcionesByAlumnoId(alumnoId: number): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(this.myAppUrl + this.myApiUrl + "/" + alumnoId + "/" + "inscripciones").pipe(
      catchError(this.handleError.bind(this))
    );
  }
}
