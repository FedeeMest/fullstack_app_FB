import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Alumno } from '../interfaces/alumno';
import { Inscripcion } from '../interfaces/inscripcion';

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

  getAlumno(id: number): Observable<Alumno>{
    return this.http.get<Alumno>(this.myAppUrl + this.myApiUrl + "/" + id);
  }

  updateAlumno(id: number, alumno: Alumno): Observable<Alumno>{
    return this.http.put<Alumno>(this.myAppUrl + this.myApiUrl + "/" + id, alumno);
  }

  getAlumnoByLegajo(legajo: number): Observable<Alumno | null> {
    console.log('Llamando a la API para buscar alumno con legajo:', legajo);
    return this.http.get<Alumno>(this.myAppUrl + this.myApiUrl + "/" + "legajo" + "/" + legajo);
}

  getInscripcionesByAlumnoId(alumnoId: number): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(this.myAppUrl + this.myApiUrl + "/" + alumnoId + "/" + "inscripciones");
}
}
