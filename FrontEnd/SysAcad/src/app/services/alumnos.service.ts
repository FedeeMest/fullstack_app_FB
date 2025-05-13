import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'; // Importa las variables de entorno
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Módulos para realizar solicitudes HTTP y manejar errores
import { Observable, throwError } from 'rxjs'; // Manejo de observables y errores
import { Alumno } from '../interfaces/alumno'; // Interfaz para el modelo de Alumno
import { Inscripcion } from '../interfaces/inscripcion'; // Interfaz para el modelo de Inscripción
import { catchError } from 'rxjs/operators'; // Operador para manejar errores en las solicitudes HTTP

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible en toda la aplicación
})
export class AlumnosService {
  private myAppUrl: string; // URL base de la aplicación
  private myApiUrl: string; // URL específica para la API de alumnos

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint; // Asigna la URL base desde las variables de entorno
    this.myApiUrl = '/api/alumnos'; // Define la ruta específica para los alumnos
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
        errorMessage = 'El alumno no fue encontrado.'; // Error 404: No encontrado
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

  // Método para obtener todos los alumnos
  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.myAppUrl + this.myApiUrl).pipe(
      catchError(this.handleError.bind(this)) // Maneja errores en la solicitud
    );
  }

  // Método para eliminar un alumno por su ID
  deleteAlumno(id: number): Observable<void> {
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + "/" + id).pipe(
      catchError(this.handleError.bind(this)) // Maneja errores en la solicitud
    );
  }

  // Método para guardar un nuevo alumno
  saveAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(this.myAppUrl + this.myApiUrl, alumno).pipe(
      catchError(this.handleError.bind(this)) // Maneja errores en la solicitud
    );
  }

  // Método para obtener un alumno por su ID
  getAlumno(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(this.myAppUrl + this.myApiUrl + "/" + id).pipe(
      catchError(this.handleError.bind(this)) // Maneja errores en la solicitud
    );
  }

  // Método para actualizar un alumno existente
  updateAlumno(id: number, alumno: Alumno): Observable<Alumno> {
    return this.http.put<Alumno>(this.myAppUrl + this.myApiUrl + "/" + id, alumno).pipe(
      catchError(this.handleError.bind(this)) // Maneja errores en la solicitud
    );
  }

  // Método para obtener un alumno por su legajo
  getAlumnoByLegajo(legajo: number): Observable<Alumno | null> {
    console.log('Llamando a la API para buscar alumno con legajo:', legajo);
    return this.http.get<Alumno>(this.myAppUrl + this.myApiUrl + "/" + "legajo" + "/" + legajo).pipe(
      catchError(this.handleError.bind(this)) // Maneja errores en la solicitud
    );
  }

  // Método para obtener las inscripciones de un alumno por su ID
  getInscripcionesByAlumnoId(alumnoId: number): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(this.myAppUrl + this.myApiUrl + "/" + alumnoId + "/" + "inscripciones").pipe(
      catchError(this.handleError.bind(this)) // Maneja errores en la solicitud
    );
  }
}
