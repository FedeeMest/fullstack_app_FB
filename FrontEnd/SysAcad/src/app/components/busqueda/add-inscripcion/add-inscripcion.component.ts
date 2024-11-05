import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MateriaService } from '../../../services/materia.service';
import { Materia } from '../../../interfaces/materia';
import { Inscripcion } from '../../../interfaces/inscripcion';
import { InscripcionService } from '../../../services/inscripcion.service';
import { AlumnosService } from '../../../services/alumnos.service';

@Component({
  selector: 'app-add-inscripcion',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-inscripcion.component.html',
  styleUrl: './add-inscripcion.component.css'
})
export class AddInscripcionComponent implements OnInit {
  listaMaterias: Materia[] = [];
  materiasFiltradas: Materia[] = [];
  modalidadesDisponibles: string[] = [];
  materiaSeleccionada: number | null = null;
  filtroForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private location: Location,private _materiaService: MateriaService,private fb: FormBuilder, private alumnoService: AlumnosService,private inscripcionService: InscripcionService) {
    this.filtroForm = this.fb.group({
      modalidad: [''],
      fechaN: ['', Validators.required],
      materiaSeleccionada: [null, Validators.required]
    });
  }
  
  
  ngOnInit(): void {
    this.getMaterias();
    this.filtroForm.get('modalidad')?.valueChanges.subscribe((modalidadSeleccionada) => {
      this.filtrarMaterias(modalidadSeleccionada);
    });
  }
  
  getMaterias(): void {
    const alumnoRaw = localStorage.getItem('alumno');
    if (!alumnoRaw) {
      this.errorMessage = "No se encontró el alumno en el almacenamiento local.";
      return;
    }
  
    let alumno;
    try {
      alumno = JSON.parse(alumnoRaw);
    } catch (error) {
      this.errorMessage = "Error al interpretar el objeto 'alumno' del almacenamiento local.";
      return;
    }
  
    const alumnoId = alumno.id;
  
    // Primero obtenemos todas las materias
    this._materiaService.getMaterias().subscribe({
      next: (materias) => {
        this.listaMaterias = materias;
        
        // Ahora obtenemos las inscripciones del alumno
        this.alumnoService.getInscripcionesByAlumnoId(alumnoId).subscribe({
          next: (inscripciones) => {
            const materiaIdsInscritas = new Set(inscripciones.map(inscripcion => inscripcion.mat_id));
            
            // Filtramos las materias para excluir las que ya tienen inscripción
            this.materiasFiltradas = this.listaMaterias.filter(materia => materia.id !== undefined && !materiaIdsInscritas.has(materia.id));

            this.extraerModalidadesDisponibles();
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

  extraerModalidadesDisponibles(): void {
    // Obtener modalidades únicas de la lista de materias
    const modalidades = this.listaMaterias.map((materia) => materia.modalidad);
    this.modalidadesDisponibles = Array.from(new Set(modalidades.filter(Boolean)));
  }

  filtrarMaterias(modalidadSeleccionada: string): void {
    if (modalidadSeleccionada) {
      this.materiasFiltradas = this.listaMaterias.filter(
        (materia) => materia.modalidad === modalidadSeleccionada
      );
    } else {
      this.materiasFiltradas = [...this.listaMaterias];
    }
  }

  crearInscripcion(): void {
    const alumnoRaw = localStorage.getItem('alumno');
  
    // Verifica que 'alumno' exista en localStorage
    if (!alumnoRaw) {
      this.errorMessage = "No se encontró el alumno en el almacenamiento local.";
      return;
    }
  
    let alumno;
    try {
      alumno = JSON.parse(alumnoRaw); // Intenta parsear el JSON de 'alumno'
    } catch (error) {
      this.errorMessage = "Error al interpretar el objeto 'alumno' del almacenamiento local.";
      console.error("Error de parseo:", error);
      return;
    }
  
    // Verifica que 'alumno' tenga la propiedad 'id'
    if (!alumno.id) {
      this.errorMessage = "El objeto 'alumno' no contiene un 'id' válido.";
      return;
    }
  
    const alumnoId = alumno.id;
    const fecha = this.filtroForm.get('fechaN')?.value;
    const materiaSeleccionada = this.filtroForm.get('materiaSeleccionada')?.value;
  
    // Prepara el objeto de inscripción con los datos obtenidos
    const inscripcion: Inscripcion = {
      fecha,
      alum_id: alumnoId,
      mat_id: materiaSeleccionada
    };
  
    this.inscripcionService.addInscripcion(inscripcion).subscribe({
      next: (response) => {
        console.log('Inscripción creada:', response);
        this.goBack();
      },
      error: (err) => {
        this.errorMessage = `Error al crear la inscripción: ${err.message}`;
      }
    });
  }
  

  goBack() {
    this.location.back();
  }
}
