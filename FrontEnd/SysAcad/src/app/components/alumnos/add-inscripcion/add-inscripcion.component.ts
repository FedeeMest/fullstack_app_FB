import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Inscripcion } from '../../../interfaces/inscripcion';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Materia } from '../../../interfaces/materia';
import { MateriaService } from '../../../services/materia.service';
import { AlumnosService } from '../../../services/alumnos.service';
import { InscripcionService } from '../../../services/inscripcion.service';

// Validación personalizada para la fecha
function fechaValida(control: AbstractControl): { [key: string]: boolean } | null {
  const fechaSeleccionada = new Date(control.value); // Convierte el valor del control en una fecha
  const fechaActual = new Date(); // Obtiene la fecha actual
  fechaActual.setHours(0, 0, 0, 0); // Ignora la hora para comparar solo la fecha
  if (fechaSeleccionada < fechaActual) {
    return { fechaInvalida: true }; // Devuelve un error si la fecha seleccionada es anterior a la actual
  }
  return null; // Devuelve null si la fecha es válida
}

@Component({
  selector: 'app-add-inscripcion', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // Módulos necesarios para el componente
  templateUrl: './add-inscripcion.component.html', // Ruta al archivo HTML del componente
  styleUrl: './add-inscripcion.component.css' // Ruta al archivo CSS del componente
})
export class AddInscripcionComponent implements OnInit {
  alumnoId!: number; // ID del alumno que se inscribirá
  listaMaterias: Materia[] = []; // Lista completa de materias obtenida desde la API
  materiasFiltradas: Materia[] = []; // Lista de materias disponibles para inscripción (excluye materias ya inscritas)
  modalidadesDisponibles: string[] = []; // Modalidades únicas disponibles entre las materias
  filtroForm: FormGroup; // Formulario reactivo para manejar los datos de inscripción
  errorMessage: string | null = null; // Mensaje de error para mostrar al usuario

  constructor(
    private route: ActivatedRoute, // Servicio para obtener parámetros de la ruta
    private location: Location, // Servicio para manejar la navegación hacia atrás
    private _materiaService: MateriaService, // Servicio para interactuar con la API de materias
    private fb: FormBuilder, // Constructor de formularios reactivos
    private alumnoService: AlumnosService, // Servicio para interactuar con la API de alumnos
    private inscripcionService: InscripcionService, // Servicio para interactuar con la API de inscripciones
    private toastr: ToastrService // Servicio para mostrar notificaciones
  ) {
    // Inicializa el formulario con validaciones
    this.filtroForm = this.fb.group({
      modalidad: [''], // Campo para filtrar por modalidad
      fechaN: ['', [Validators.required, fechaValida]], // Campo obligatorio para la fecha de inscripción con validación personalizada
      materiaSeleccionada: [null, Validators.required] // Campo obligatorio para seleccionar una materia
    });
  }

  ngOnInit(): void {
    this.getMaterias(); // Llama al método para obtener la lista de materias al inicializar el componente
    this.route.params.subscribe((params) => {
      const id = +params['id']; // Obtiene el ID del alumno desde los parámetros de la ruta
      if (!isNaN(id) && id > 0) {
        this.alumnoId = id; // Asigna el ID del alumno
        console.log('ID del alumno recibido desde queryParams:', this.alumnoId);
      } else {
        console.log('No se recibió un ID válido en los queryParams');
      }
    });

    // Escucha cambios en el filtro de modalidad y actualiza la lista de materias filtradas
    this.filtroForm.get('modalidad')?.valueChanges.subscribe((modalidadSeleccionada) => {
      this.filtrarMaterias(modalidadSeleccionada);
    });
  }

  // Método para obtener la lista de materias desde la API
  getMaterias(): void {
    this._materiaService.getMaterias().subscribe({
      next: (materias) => {
        this.listaMaterias = materias; // Asigna la lista completa de materias
        this.alumnoService.getInscripcionesByAlumnoId(this.alumnoId).subscribe({
          next: (inscripciones) => {
            const materiaIdsInscritas = new Set(inscripciones.map((inscripcion) => inscripcion.materia)); // Obtiene los IDs de las materias ya inscritas
            this.materiasFiltradas = this.listaMaterias.filter(
              (materia) => materia.id !== undefined && !materiaIdsInscritas.has(materia.id) // Filtra las materias no inscritas
            );
            this.extraerModalidadesDisponibles(); // Extrae las modalidades únicas disponibles
          },
          error: (err) => {
            this.errorMessage = `Error al cargar las inscripciones: ${err.message}`; // Maneja errores al cargar inscripciones
          }
        });
      },
      error: (err) => {
        this.errorMessage = `Error al cargar las materias: ${err.message}`; // Maneja errores al cargar materias
      }
    });
  }

  // Método para extraer las modalidades únicas disponibles
  extraerModalidadesDisponibles(): void {
    const modalidades = this.listaMaterias.map((materia) => materia.modalidad); // Obtiene las modalidades de las materias
    this.modalidadesDisponibles = Array.from(new Set(modalidades.filter(Boolean))); // Elimina duplicados y valores nulos
  }

  // Método para filtrar materias según la modalidad seleccionada
  filtrarMaterias(modalidadSeleccionada: string): void {
    if (modalidadSeleccionada) {
      this.materiasFiltradas = this.listaMaterias.filter(
        (materia) => materia.modalidad === modalidadSeleccionada // Filtra las materias por modalidad
      );
    } else {
      this.materiasFiltradas = [...this.listaMaterias]; // Si no hay filtro, muestra todas las materias
    }
  }

  // Método para crear una inscripción
  crearInscripcion(): void {
    if (confirm('¿Estás seguro de que deseas realizar esta inscripción?')) { // Confirma la acción con el usuario
      const alumnoId = this.alumnoId;
      const fecha = this.filtroForm.get('fechaN')?.value; // Obtiene la fecha de inscripción del formulario
      const materiaSeleccionada = this.filtroForm.get('materiaSeleccionada')?.value; // Obtiene la materia seleccionada

      const inscripcion: Inscripcion = {
        fecha,
        alumno: alumnoId,
        materia: materiaSeleccionada
      };

      this.inscripcionService.addInscripcion(inscripcion).subscribe({
        next: (response) => {
          console.log('Inscripción creada:', response); // Muestra en consola la inscripción creada
          this.toastr.success('La inscripción fue creada con éxito', 'Inscripción Creada', {
            progressBar: true,
            progressAnimation: 'decreasing'
          }); // Muestra una notificación de éxito
          this.goBack(); // Vuelve a la página anterior
        },
        error: (err) => {
          this.errorMessage = `Error al crear la inscripción: ${err.message}`; // Maneja errores al crear la inscripción
        }
      });
    }
  }

  // Método para volver a la página anterior
  goBack(): void {
    this.location.back(); // Navega hacia atrás en el historial
  }
}