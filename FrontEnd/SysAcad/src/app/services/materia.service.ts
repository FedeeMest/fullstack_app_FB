import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materia } from '../interfaces/materia.js';

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
    return this.http.get<Materia[]>(this.myAppUrl + this.myApiUrl);
  }

  deleteMateria(id: number): Observable<void>{
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + "/"+ id);
  }

  saveMateria(materia: Materia): Observable<Materia>{
    return this.http.post<Materia>(this.myAppUrl + this.myApiUrl, materia);
  }

  getMateria(id: number): Observable<Materia>{
    return this.http.get<Materia>(this.myAppUrl + this.myApiUrl + "/" + id);
  }

  updateMateria(id: number, materia: Materia): Observable<Materia>{
    return this.http.put<Materia>(this.myAppUrl + this.myApiUrl + "/" + id, materia);
  }
}
