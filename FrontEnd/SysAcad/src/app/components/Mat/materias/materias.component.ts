import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Materia } from '../../../interfaces/materia';
import { MateriaService } from '../../../services/materia.service';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule],
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css'] // Corregido a styleUrls
})
export class MateriasComponent implements OnInit {
  listaMaterias: Materia[] = [];
  errorMessage: string | null = null; // Inicializar la variable para el mensaje de error

  constructor(private _materiaService: MateriaService) { }

  ngOnInit(): void {
    const storedAlumno = localStorage.getItem('alumno');
    if (storedAlumno) {
      localStorage.removeItem('alumno');
      console.log('Alumno eliminado del localStorage');
    }
    this.getMaterias();
  }

  getMaterias() {
    this._materiaService.getMaterias().subscribe({
      next: (response) => {
        this.listaMaterias = response;
        this.errorMessage = null; // Resetear el mensaje de error al obtener datos correctamente
        console.log(response);
      },
      error: (err) => {
        this.errorMessage = `Error al cargar las materias: ${err.message}`; // Mensaje claro al usuario
        console.error('Error fetching data', err);
      }
    });
  }

  deleteMateria(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta materia?')) {
      this._materiaService.deleteMateria(id).subscribe({
        next: (response) => {
          console.log('Materia eliminada', response);
          this.getMaterias();
        },
        error: (err) => {
          this.errorMessage = `Error al eliminar la materia: ${err.message}`; // Mensaje claro al usuario
          console.error('Error al eliminar la materia', err);
        }
      });
    }
  }
  
}
