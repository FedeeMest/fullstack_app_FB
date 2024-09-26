import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumno } from '../interfaces/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {
  private myAppUrl: string
  private myApiUrl: string


  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/alumnos';
   }
  
  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.myAppUrl + this.myApiUrl);
  }

  deleteAlumno(id: number): Observable<void>{
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + "/"+ id);
  }

  saveAlumno(alumno: Alumno): Observable<Alumno>{
    return this.http.post<Alumno>(this.myAppUrl + this.myApiUrl, alumno);
  }
}
