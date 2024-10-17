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
  private myAppUrl: string
  private myApiUrl: string

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/materias';
  }

  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.myAppUrl + this.myApiUrl)
    .pipe(catchError(this.handleError));
  }

  deleteMateria(id: number): Observable<void>{
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + "/"+ id)
    .pipe(catchError(this.handleError));
  }

  saveMateria(materia: Materia): Observable<Materia>{
    return this.http.post<Materia>(this.myAppUrl + this.myApiUrl, materia)
    .pipe(catchError(this.handleError));
  }

  getMateria(id: number): Observable<Materia>{
    return this.http.get<Materia>(this.myAppUrl + this.myApiUrl + "/" + id)
    .pipe(catchError(this.handleError));
  }

  updateMateria(id: number, materia: Materia): Observable<Materia>{
    return this.http.put<Materia>(this.myAppUrl + this.myApiUrl + "/" + id, materia)
    .pipe(catchError(this.handleError));
  }

    // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.status === 409) {
      // Error de entrada duplicada (409 Conflict)
      errorMessage = 'Ya existe una materia con el nombre proporcionado.';
    } else if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de la red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error del servidor: ${error.status}, Mensaje: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
