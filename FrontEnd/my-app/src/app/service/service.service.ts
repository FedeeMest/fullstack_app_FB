import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { alumno } from '../models/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private urlEndPoint: string = 'http://localhost:3000/api/alumnos';

  constructor(private http: HttpClient) { }

  getAlumnos(): Observable <any[]> {
    return this.http.get<(any[])>(this.urlEndPoint).pipe(
      map(response => response as any[])
    )
}
}
