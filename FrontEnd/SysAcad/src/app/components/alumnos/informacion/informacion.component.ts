import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Alumno } from '../../../interfaces/alumno'; // Interfaz para el modelo de Alumno
import { AlumnosService } from '../../../services/alumnos.service'; // Servicio para interactuar con la API de alumnos
import { JwtHelperService } from '@auth0/angular-jwt'; // Servicio para decodificar el token JWT

@Component({
  selector: 'app-informacion', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [CommonModule], // Módulos necesarios para el componente
  templateUrl: './informacion.component.html', // Ruta al archivo HTML del componente
  styleUrls: ['./informacion.component.css'] // Ruta al archivo CSS del componente
})
export class InformacionComponent implements OnInit {
  alumno: Alumno | null = null; // Información del alumno
  private jwtHelper = new JwtHelperService(); // Instancia del servicio para manejar el token JWT
  id: number | null = null; // ID del usuario obtenido del token

  constructor(
    private activatedroute: ActivatedRoute, // Servicio para obtener parámetros de la ruta
    private router: Router, // Servicio para redirigir
    private location: Location, // Servicio para manejar la navegación hacia atrás
    private alumnosService: AlumnosService // Servicio para interactuar con la API de alumnos
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token'); // Obtiene el token almacenado en el sessionStorage
    if (!token) {
      console.error('No se encontró el token'); // Muestra un error si no hay token
      this.router.navigate(['/login']); // Redirige al login si no hay token
      return;
    }

    const decodedToken = this.jwtHelper.decodeToken(token); // Decodifica el token JWT
    this.id = decodedToken.id; // Obtiene el ID del usuario desde el token

    this.activatedroute.params.subscribe((params) => {
      const routeAlumnoId = +params['id']; // Obtiene el ID del alumno desde los parámetros de la ruta

      // Verificar si el ID del token coincide con el ID de la ruta
      if (this.id !== routeAlumnoId) {
        console.error('Acceso denegado: El ID del token no coincide con el ID de la ruta'); // Muestra un error si los IDs no coinciden
        this.router.navigate(['/informacion/' + this.id]); // Redirige al alumno correspondiente
        return;
      }

      // Si los IDs coinciden, cargar la información del alumno
      this.alumnosService.getAlumno(routeAlumnoId).subscribe({
        next: (alumno) => {
          this.alumno = alumno; // Asigna los datos del alumno
        },
        error: (err) => {
          console.error('Error al obtener los datos del alumno:', err); // Muestra un error si no se pueden obtener los datos
          this.goBack(); // Vuelve a la página anterior
        },
      });
    });
  }

  // Método para ver las inscripciones del alumno
  verInscripciones(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/lista_insc', id]); // Redirige a la lista de inscripciones del alumno
    } else {
      console.error('No se pudo obtener el ID del alumno'); // Muestra un error si no se puede obtener el ID
    }
  }

  // Método para volver a la página anterior
  goBack(): void {
    this.location.back(); // Navega hacia atrás en el historial
  }

  // Método para ir al cambio de contraseña
  goToChangePassword(): void {
    if (this.id !== null) {
      this.router.navigate([`/change-password/${this.id}`]); // Pasar el ID del alumno en la ruta
    } else {
      console.error('No se pudo obtener el ID del usuario desde el token'); // Muestra un error si no se puede obtener el ID
    }
  }
}