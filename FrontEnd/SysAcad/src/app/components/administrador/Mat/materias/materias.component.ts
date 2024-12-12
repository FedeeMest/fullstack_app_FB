import { Component, OnInit } from '@angular/core';
import { Materia } from '../../../../interfaces/materia';
import { MateriaService } from '../../../../services/materia.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule, ReactiveFormsModule, NgIf],
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']
})
export class MateriasComponent implements OnInit {
  listaMaterias: Materia[] = [];
  materiasFiltradas: Materia[] = [];
  modalidadesDisponibles: string[] = [];
  filtroForm: FormGroup;
  errorMessage: string | null = null;


  constructor(private _materiaService: MateriaService,private fb: FormBuilder, private router: Router,private toastr: ToastrService) {
    // Inicializar el formulario de filtro
    this.filtroForm = this.fb.group({
      modalidad: ['']
    });
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
    const storedAlumno = localStorage.getItem('alumno');
    if (storedAlumno) {
      localStorage.removeItem('alumno');
      console.log('Alumno eliminado del localStorage');
    }
  }
    this.getMaterias();

    // Escuchar cambios en el filtro
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

  deleteMateria(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta materia?')) {
      this._materiaService.deleteMateria(id).subscribe({
        next: () => {
          console.log('Materia eliminada');
          this.toastr.error('La materia fue eliminada con éxito', 'Materia eliminada',{
            progressBar: true,
            progressAnimation:'decreasing'
          });
          this.getMaterias();
        },
        error: (err) => {
          this.errorMessage = `Error al eliminar la materia: ${err.message}`;
          console.error('Error al eliminar la materia', err);
        }
      });
    }
  }

  goadd(){
    this.router.navigate(['/add_materia']);
  }
}
