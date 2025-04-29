import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MateriaService } from '../../../../services/materia.service';
import { Materia } from '../../../../interfaces/materia';
import { Inscripcion } from '../../../../interfaces/inscripcion';
import { InscripcionService } from '../../../../services/inscripcion.service';
import { AlumnosService } from '../../../../services/alumnos.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-inscripcion', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // Módulos necesarios para el componente
  templateUrl: './add-inscripcion.component.html', // Ruta al archivo HTML del componente
  styleUrl: './add-inscripcion.component.css' // Ruta al archivo CSS del componente
})
export class AddInscripcionComponent implements OnInit {
  alumnoId!: number; // ID del alumno que se inscribirá
  listaMaterias: Materia[] = []; // Lista completa de materias
  materiasFiltradas: Materia[] = []; // Lista de materias disponibles para inscripción
  modalidadesDisponibles: string[] = []; // Modalidades únicas disponibles
  materiaSeleccionada: number | null = null; // ID de la materia seleccionada
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
    // Inicializar el formulario con validaciones
    this.filtroForm = this.fb.group({
      modalidad: [''], // Campo para filtrar por modalidad
      fechaN: ['', Validators.required], // Campo obligatorio para la fecha de inscripción
      materiaSeleccionada: [null, Validators.required] // Campo obligatorio para seleccionar una materia
    });
  }

  ngOnInit(): void {
    this.getMaterias(); // Obtener la lista de materias al inicializar el componente

    // Obtener el ID del alumno desde los parámetros de la ruta
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (!isNaN(id) && id > 0) {
        this.alumnoId = id;
        console.log('ID del alumno recibido desde queryParams:', this.alumnoId);
      } else {
        console.log('No se recibió un ID válido en los queryParams');
      }
    });

    // Escuchar cambios en el filtro de modalidad
    this.filtroForm.get('modalidad')?.valueChanges.subscribe((modalidadSeleccionada) => {
      this.filtrarMaterias(modalidadSeleccionada);
    });
  }

  // Método para obtener la lista de materias desde la API
  getMaterias(): void {
    this._materiaService.getMaterias().subscribe({
      next: (materias) => {
        this.listaMaterias = materias;

        // Obtener las inscripciones del alumno para filtrar materias ya inscritas
        this.alumnoService.getInscripcionesByAlumnoId(this.alumnoId).subscribe({
          next: (inscripciones) => {
            const materiaIdsInscritas = new Set(inscripciones.map((inscripcion) => inscripcion.materia));
            this.materiasFiltradas = this.listaMaterias.filter(
              (materia) => materia.id !== undefined && !materiaIdsInscritas.has(materia.id)
            );
            this.extraerModalidadesDisponibles(); // Extraer modalidades únicas
          },
          error: (err) => {
            this.errorMessage = `Error al cargar las inscripciones: ${err.message}`;
          }
        });
      },
      error: (err) => {
        this.errorMessage = `Error al cargar las materias: ${err.message}`;
      }
    });
  }

  // Método para extraer las modalidades únicas disponibles
  extraerModalidadesDisponibles(): void {
    const modalidades = this.listaMaterias.map((materia) => materia.modalidad);
    this.modalidadesDisponibles = Array.from(new Set(modalidades.filter(Boolean)));
  }

  // Método para filtrar materias según la modalidad seleccionada
  filtrarMaterias(modalidadSeleccionada: string): void {
    if (modalidadSeleccionada) {
      this.materiasFiltradas = this.listaMaterias.filter(
        (materia) => materia.modalidad === modalidadSeleccionada
      );
    } else {
      this.materiasFiltradas = [...this.listaMaterias];
    }
  }

  // Método para crear una inscripción
  crearInscripcion(): void {
    const alumnoId = this.alumnoId;
    const fecha = this.filtroForm.get('fechaN')?.value;
    const materiaSeleccionada = this.filtroForm.get('materiaSeleccionada')?.value;

    const inscripcion: Inscripcion = {
      fecha,
      alumno: alumnoId,
      materia: materiaSeleccionada
    };

    this.inscripcionService.addInscripcion(inscripcion).subscribe({
      next: (response) => {
        console.log('Inscripción creada:', response);
        this.toastr.success('La inscripción fue creada con éxito', 'Inscripción Creada', {
          progressBar: true,
          progressAnimation: 'decreasing'
        });
        this.goBack(); // Volver a la página anterior
      },
      error: (err) => {
        this.errorMessage = `Error al crear la inscripción: ${err.message}`;
      }
    });
  }

  // Método para volver a la página anterior
  goBack(): void {
    this.location.back();
  }
}