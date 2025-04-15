import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Inscripcion } from '../../../interfaces/inscripcion';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Materia } from '../../../interfaces/materia';
import { MateriaService } from '../../../services/materia.service';
import { AlumnosService } from '../../../services/alumnos.service';
import { InscripcionService } from '../../../services/inscripcion.service';

@Component({
  selector: 'app-add-inscripcion',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-inscripcion.component.html',
  styleUrl: './add-inscripcion.component.css'
})
export class AddInscripcionComponent implements OnInit {
  alumnoId!: number;
  listaMaterias: Materia[] = [];
  materiasFiltradas: Materia[] = [];
  modalidadesDisponibles: string[] = [];
  materiaSeleccionada: number | null = null;
  filtroForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute,private location: Location,private _materiaService: MateriaService,private fb: FormBuilder, private alumnoService: AlumnosService,private inscripcionService: InscripcionService,private toastr: ToastrService) {
    this.filtroForm = this.fb.group({
      modalidad: [''],
      fechaN: ['', Validators.required],
      materiaSeleccionada: [null, Validators.required]
    });
  }
  
  
  ngOnInit(): void {
    this.getMaterias();
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if(!isNaN(id) && id > 0){
        this.alumnoId = id;
        console.log('ID del alumno recibido desde queryParams:', this.alumnoId);
        } else {
          console.log('No se recibió un ID válido en los queryParams');
        }
    });
    this.filtroForm.get('modalidad')?.valueChanges.subscribe((modalidadSeleccionada) => {
      this.filtrarMaterias(modalidadSeleccionada);
    });
  }
  
  getMaterias(): void {
    this._materiaService.getMaterias().subscribe({
      next: (materias) => {
        this.listaMaterias = materias;
        this.alumnoService.getInscripcionesByAlumnoId(this.alumnoId).subscribe({
          next: (inscripciones) => {
            const materiaIdsInscritas = new Set(inscripciones.map(inscripcion => inscripcion.materia));
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
        this.toastr.success('La inscripción fue creada con éxito', 'Inscripción Creada',{
          progressBar: true,
          progressAnimation:'decreasing'
        });
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
