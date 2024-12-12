import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Admin } from '../interfaces/admin.js';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private myAppUrl: string;
  private myApiUrl: string;


  constructor(private http:HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/admins';
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
          errorMessage = 'El administrador no fue encontrado.'; // Este es el caso correcto para el 404
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

  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.myAppUrl + this.myApiUrl).pipe(
     catchError(this.handleError.bind(this))
    );
  }
 
  deleteAdmin(id: number): Observable<void> {
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + "/" + id).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  saveAdmin(admin: Admin): Observable<Admin> {
    return this.http.post<Admin>(this.myAppUrl + this.myApiUrl, admin).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  updateAdmin(id: number, admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(this.myAppUrl + this.myApiUrl + "/" + id, admin).pipe(
      catchError(this.handleError.bind(this))
    );
  }
   getAdmin(id: number): Observable<Admin> {  
    return this.http.get<Admin>(this.myAppUrl + this.myApiUrl + "/" + id).pipe(
      catchError(this.handleError.bind(this))
    );

}

}