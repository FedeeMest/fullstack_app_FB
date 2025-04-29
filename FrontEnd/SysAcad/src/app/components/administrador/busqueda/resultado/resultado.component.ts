import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../../interfaces/alumno'; // Interfaz para el modelo de Alumno
import { Admin } from '../../../../interfaces/admin'; // Interfaz para el modelo de Admin
import { Router, ActivatedRoute } from '@angular/router'; // Servicios para manejar rutas y parámetros
import { CommonModule } from '@angular/common'; // Módulos comunes de Angular
import { Location } from '@angular/common'; // Servicio para manejar la navegación hacia atrás
import { AlumnosService } from '../../../../services/alumnos.service'; // Servicio para interactuar con la API de alumnos
import { AdminService } from '../../../../services/admin.service'; // Servicio para interactuar con la API de admins

@Component({
  selector: 'app-resultado', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [CommonModule], // Módulos necesarios para el componente
  templateUrl: './resultado.component.html', // Ruta al archivo HTML del componente
  styleUrls: ['./resultado.component.css'] // Ruta al archivo CSS del componente
})
export class ResultadoComponent implements OnInit {
  alumno: Alumno | null = null; // Información del alumno
  admin: Admin | null = null; // Información del admin
  tabla: string = ''; // Indica si se está mostrando información de alumnos o admins

  constructor(
    private activatedroute: ActivatedRoute, // Servicio para obtener parámetros de la ruta
    private router: Router, // Servicio para redirigir
    private location: Location, // Servicio para manejar la navegación hacia atrás
    private alumnosService: AlumnosService, // Servicio para interactuar con la API de alumnos
    private adminService: AdminService // Servicio para interactuar con la API de admins
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario y la tabla desde los parámetros de la ruta
    this.activatedroute.params.subscribe((params) => {
      const tabla = params['tabla'];
      const userId = +params['id'];
      this.tabla = tabla;
      console.log('Tabla:', this.tabla);
      console.log('ID del usuario:', userId);

      if (userId) {
        if (this.tabla === 'admins') {
          // Si se accede a la tabla de Admins
          this.adminService.getAdmin(userId).subscribe({
            next: (admin) => {
              this.admin = admin; // Asignar los datos del admin
            },
            error: (err) => {
              console.error('Error al obtener los datos del admin:', err);
              this.goBack(); // Volver si ocurre un error
            }
          });
        } else if (this.tabla === 'alumnos') {
          // Si se accede a la tabla de Alumnos
          this.alumnosService.getAlumno(userId).subscribe({
            next: (alumno) => {
              this.alumno = alumno; // Asignar los datos del alumno
            },
            error: (err) => {
              console.error('Error al obtener los datos del alumno:', err);
              this.goBack(); // Volver si ocurre un error
            }
          });
        }
      }
    });
  }

  // Método para editar un alumno
  editarAlumno(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/admin/editar_alumno', id], { state: { from: 'resultado' } });
    } else {
      console.error('No se pudo obtener el ID del alumno');
    }
  }

  // Método para editar un admin
  editarAdmin(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/admin/editar_admin', id], { state: { from: 'resultado' } });
    } else {
      console.error('No se pudo obtener el ID del admin');
    }
  }

  // Método para ver las inscripciones de un alumno
  verInscripciones(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/lista_insc', id]);
    } else {
      console.error('No se pudo obtener el ID del alumno');
    }
  }

  // Método para volver a la página anterior
  goBack(): void {
    this.location.back();
  }
}