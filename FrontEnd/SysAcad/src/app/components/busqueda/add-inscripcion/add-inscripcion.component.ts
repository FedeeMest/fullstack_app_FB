import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { MateriaService } from '../../../services/materia.service';
import { Materia } from '../../../interfaces/materia';

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

  constructor(private location: Location,private _materiaService: MateriaService,private fb: FormBuilder) {
    this.filtroForm = this.fb.group({
      modalidad: ['']
    });
  }
  
  
  ngOnInit():void{
    this.getMaterias();
    this.filtroForm.get('modalidad')?.valueChanges.subscribe((modalidadSeleccionada) => {
      this.filtrarMaterias(modalidadSeleccionada);
    });
  }

  getMaterias(): void {
    this._materiaService.getMaterias().subscribe({
      next: (response) => {
        this.listaMaterias = response;
        this.materiasFiltradas = [...this.listaMaterias];
        this.extraerModalidadesDisponibles();
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = `Error al cargar las materias: ${err.message}`;
        console.error('Error fetching data', err);
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

  goBack() {
    this.location.back();
  }
}
