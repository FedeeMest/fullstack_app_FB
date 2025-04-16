import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Inscripcion } from '../interfaces/inscripcion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'

})

export class InscripcionService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/inscripciones';
  }

  // Método para obtener el token del localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');  // O donde guardas el token
    if (!token) {
      throw new Error('No token found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  addInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    const headers = this.getAuthHeaders();
    return this.http.post<Inscripcion>(this.myAppUrl + this.myApiUrl, inscripcion, { headers });
  }

  deleteInscripcion(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + "/" + id, { headers });
  }
}
