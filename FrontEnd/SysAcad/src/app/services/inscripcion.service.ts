import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development'; // Importa las variables de entorno
import { Inscripcion } from '../interfaces/inscripcion'; // Interfaz para el modelo de Inscripción
import { Observable } from 'rxjs'; // Manejo de observables

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible en toda la aplicación
})
export class InscripcionService {
  private myAppUrl: string; // URL base de la aplicación
  private myApiUrl: string; // URL específica para la API de inscripciones

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint; // Asigna la URL base desde las variables de entorno
    this.myApiUrl = '/api/inscripciones'; // Define la ruta específica para las inscripciones
  }

  // Método para obtener el token del localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); // Obtiene el token almacenado en el localStorage
    if (!token) {
      throw new Error('No token found'); // Lanza un error si no hay token
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`); // Devuelve los encabezados con el token
  }

  // Método para agregar una nueva inscripción
  addInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    const headers = this.getAuthHeaders(); // Obtiene los encabezados con el token
    return this.http.post<Inscripcion>(this.myAppUrl + this.myApiUrl, inscripcion, { headers }); // Realiza una solicitud POST
  }

  // Método para eliminar una inscripción por su ID
  deleteInscripcion(id: number): Observable<void> {
    const headers = this.getAuthHeaders(); // Obtiene los encabezados con el token
    return this.http.delete<void>(this.myAppUrl + this.myApiUrl + "/" + id, { headers }); // Realiza una solicitud DELETE
  }
}
