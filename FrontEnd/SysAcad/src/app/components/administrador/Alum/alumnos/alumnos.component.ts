import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../../interfaces/alumno'; // Interfaz para el modelo de Alumno
import { AlumnosService } from '../../../../services/alumnos.service'; // Servicio para interactuar con la API de alumnos
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; // Formularios reactivos
import { CommonModule, NgFor } from '@angular/common'; // Módulos comunes de Angular
import { RouterModule, Router } from '@angular/router'; // Servicios para redirigir y manejar rutas
import { ToastrService } from 'ngx-toastr'; // Servicio para mostrar notificaciones

@Component({
  selector: 'app-alumnos', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [NgFor, CommonModule, RouterModule, ReactiveFormsModule], // Módulos necesarios para el componente
  templateUrl: './alumnos.component.html', // Ruta al archivo HTML del componente
  styleUrl: './alumnos.component.css', // Ruta al archivo CSS del componente
})
export class AlumnosComponent implements OnInit {
  listaAlumnos: Alumno[] = []; // Lista completa de alumnos obtenidos desde la API
  alumnosFiltrados: Alumno[] = []; // Lista de alumnos filtrados según el plan seleccionado
  planesDisponibles: string[] = []; // Lista de planes disponibles
  filtroForm: FormGroup; // Formulario reactivo para manejar el filtro por plan

  constructor(
    private _alumnoService: AlumnosService, // Servicio para interactuar con la API
    private fb: FormBuilder, // Constructor de formularios reactivos
    private router: Router, // Servicio para redirigir
    private toastr: ToastrService // Servicio para mostrar notificaciones
  ) {
    // Inicializar el formulario de filtro
    this.filtroForm = this.fb.group({
      plan: [''], // Campo para seleccionar un plan
    });
  }

  ngOnInit(): void {
    this.getAlumnos(); // Obtener la lista de alumnos al inicializar el componente
    // Escuchar cambios en el filtro de plan
    this.filtroForm.get('plan')?.valueChanges.subscribe((planSeleccionado) => {
      this.filtrarAlumnos(planSeleccionado); // Filtrar alumnos según el plan seleccionado
    });
  }

  // Método para obtener la lista de alumnos desde la API
  getAlumnos(): void {
    this._alumnoService.getAlumnos().subscribe({
      next: (response) => {
        this.listaAlumnos = response ?? []; // Asignar la lista de alumnos obtenida
        this.alumnosFiltrados = [...this.listaAlumnos]; // Inicializar la lista filtrada
        this.extraerPlanesDisponibles(); // Extraer los planes disponibles
      },
      error: (err) => {
        console.error('Error fetching data', err); // Loguear errores en la consola
      },
    });
  }

  // Método para ver la información de un alumno
  verAlumno(alumno: Alumno): void {
    const alumnoId = alumno.id; // Obtener el ID del alumno seleccionado
    this.toastr.info('Mostrando la información del alumno seleccionado', 'Alumno Seleccionado', {
      progressBar: true,
      progressAnimation: 'decreasing',
    });
    this.router.navigate(['/admin/resultado', 'alumnos', alumnoId]); // Redirigir a la página de detalles del alumno
  }

  // Método para extraer los planes disponibles de la lista de alumnos
  extraerPlanesDisponibles(): void {
    const planes = this.listaAlumnos.map((alumno) => alumno.plan); // Obtener los planes de los alumnos
    this.planesDisponibles = Array.from(new Set(planes.filter(Boolean))); // Eliminar duplicados y valores nulos
  }

  // Método para filtrar alumnos según el plan seleccionado
  filtrarAlumnos(planSeleccionado: string): void {
    if (planSeleccionado) {
      this.alumnosFiltrados = this.listaAlumnos.filter(
        (alumno) => alumno.plan === planSeleccionado
      );
    } else {
      this.alumnosFiltrados = [...this.listaAlumnos]; // Mostrar todos los alumnos si no hay filtro
    }
  }

  // Método para eliminar un alumno
  deleteAlumno(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este alumno?')) {
      this._alumnoService.deleteAlumno(id).subscribe({
        next: () => {
          console.log('Alumno eliminado');
          this.toastr.error('El alumno fue eliminado con éxito', 'Alumno Eliminado', {
            progressBar: true,
            progressAnimation: 'decreasing',
          });
          this.getAlumnos(); // Actualizar la lista de alumnos
        },
        error: (err) => {
          console.error('Error eliminando alumno', err); // Loguear errores en la consola
        },
      });
    }
  }

  // Método para optimizar el rendimiento del *ngFor
  trackByAlumno(index: number, alumno: Alumno): number {
    return alumno.id ?? 0; // Usar el ID del alumno como clave única
  }

  // Método para redirigir al formulario de agregar un nuevo alumno
  goAdd(): void {
    this.router.navigate(['/admin/add_alumno']); // Redirigir al formulario de agregar alumno
  }
}
