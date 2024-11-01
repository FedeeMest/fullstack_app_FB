import { HttpClient } from '@angular/common/http';
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

  addInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    return this.http.post<Inscripcion>(this.myAppUrl + this.myApiUrl, inscripcion);
  }

}
