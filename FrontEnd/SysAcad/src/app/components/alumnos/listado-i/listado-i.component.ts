import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { EMPTY, forkJoin, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Inscripcion } from '../../../interfaces/inscripcion';
import { AlumnosService } from '../../../services/alumnos.service';
import { MateriaService } from '../../../services/materia.service';
import { InscripcionService } from '../../../services/inscripcion.service';
import { Materia } from '../../../interfaces/materia';

@Component({
  selector: 'app-listado-i', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [CommonModule, NgIf], // Módulos necesarios para el componente
  templateUrl: './listado-i.component.html', // Ruta al archivo HTML del componente
  styleUrl: './listado-i.component.css' // Ruta al archivo CSS del componente
})
export class ListadoIComponent implements OnInit {
  alumnoId: number | null = null; // ID del alumno cuyas inscripciones se mostrarán
  errorMessage: boolean = false; // Indica si hay un error
  mensajeError: string = ''; // Mensaje de error para mostrar al usuario
  inscripciones: Inscripcion[] = []; // Lista de inscripciones del alumno
  materiasNombres: { [id: number]: string } = {}; // Mapeo de IDs de materias a sus nombres

  constructor(
    private route: ActivatedRoute, // Servicio para obtener parámetros de la ruta
    private alumnoService: AlumnosService, // Servicio para interactuar con la API de alumnos
    private router: Router, // Servicio para redirigir
    private materiaService: MateriaService, // Servicio para interactuar con la API de materias
    private location: Location, // Servicio para manejar la navegación hacia atrás
    private inscripcionService: InscripcionService, // Servicio para interactuar con la API de inscripciones
    private toastr: ToastrService // Servicio para mostrar notificaciones
  ) {}

  ngOnInit(): void {
    // Obtener el ID del alumno desde los parámetros de la ruta
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (!isNaN(id) && id > 0) {
        this.alumnoId = id; // Asigna el ID del alumno
        console.log('ID del alumno recibido desde queryParams:', this.alumnoId);
        this.getInscripciones(); // Llama al método para obtener las inscripciones del alumno
      } else {
        console.error('No se recibió un ID válido en los queryParams');
        this.goBack(); // Vuelve a la página anterior si el ID no es válido
      }
    });
  }

  // Método para obtener las inscripciones del alumno
  getInscripciones(): void {
    if (this.alumnoId) {
      this.alumnoService.getInscripcionesByAlumnoId(this.alumnoId).subscribe({
        next: (inscripciones: Inscripcion[]) => {
          console.log('Inscripciones encontradas:', inscripciones);
          this.inscripciones = inscripciones; // Asigna las inscripciones obtenidas
          this.loadMateriaNames(this.inscripciones); // Carga los nombres de las materias asociadas
        },
        error: (err) => {
          console.error('Error al obtener inscripciones:', err);
          if (err.status === 404) {
            this.errorMessage = true;
            this.mensajeError = 'No se encontraron inscripciones para este alumno.';
          } else {
            this.errorMessage = true;
            this.mensajeError = 'Hubo un error al obtener las inscripciones. Por favor, inténtalo de nuevo más tarde.';
          }
        }
      });
    }
  }

  // Método para cargar los nombres de las materias asociadas a las inscripciones
  loadMateriaNames(inscripciones: Inscripcion[]): void {
    const observables: Observable<Materia>[] = inscripciones.map((inscripcion) => {
      const materiaId =
        typeof inscripcion.materia === 'number'
          ? inscripcion.materia
          : parseInt(inscripcion.materia as unknown as string, 10);
      if (isNaN(materiaId)) {
        console.warn(`materia_id no es un número válido:`, inscripcion.materia);
        return EMPTY;
      }
      return this.materiaService.getMateria(materiaId); // Obtiene la materia por su ID
    });

    forkJoin(observables).subscribe({
      next: (materias: (Materia | null)[]) => {
        materias.forEach((materia) => {
          if (materia && materia.id !== undefined) {
            this.materiasNombres[materia.id] = materia.nombre; // Asigna el nombre de la materia al mapeo
          }
        });
        this.inscripciones = inscripciones; // Actualiza la lista de inscripciones
      },
      error: (err) => {
        console.error('Error al obtener nombres de materias:', err);
        this.errorMessage = true;
        this.mensajeError = 'Error al cargar los nombres de las materias.';
      }
    });
  }

  // Método para eliminar una inscripción
  deleteInscripcion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta inscripción?')) {
      this.inscripcionService.deleteInscripcion(id).subscribe({
        next: () => {
          console.log('Inscripción eliminada con éxito');
          this.toastr.error('La inscripción fue eliminada con éxito', 'Inscripción Eliminada', {
            progressBar: true,
            progressAnimation: 'decreasing'
          });
          this.getInscripciones(); // Actualiza la lista de inscripciones
        },
        error: (err) => {
          console.error('Error al eliminar inscripción:', err);
        }
      });
    }
  }

  // Método para redirigir al formulario de agregar una nueva inscripción
  goadd(): void {
    this.router.navigate(['/add_inscripcion', this.alumnoId]);
  }

  // Método para volver a la página anterior
  goBack(): void {
    this.location.back();
  }
}