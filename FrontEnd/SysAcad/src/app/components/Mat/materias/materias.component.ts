import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Materia } from '../../../interfaces/materia';
import { MateriaService } from '../../../services/materia.service';



@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [NgFor,CommonModule,RouterModule],
  templateUrl: './materias.component.html',
  styleUrl: './materias.component.css'
})
export class MateriasComponent implements OnInit{
  listaMaterias: Materia[] = [];

  constructor(private _materiaService: MateriaService) { }

  ngOnInit(): void {
    this.getMaterias();
  }

  getMaterias() {
      this._materiaService.getMaterias().subscribe({
        next: (response) => {
          this.listaMaterias = response;
          console.log(response);
        },
        error: (err) => {
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
          console.error('Error al eliminar la materia', err);
        }
      });
    }
  }

}
