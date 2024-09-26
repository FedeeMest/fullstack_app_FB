import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../interfaces/alumno';
import { AlumnosService } from '../../../services/alumnos.service';
import { CommonModule, NgFor } from '@angular/common';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [NgFor,ProgressBarComponent,CommonModule,RouterModule],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.css'
})
export class AlumnosComponent implements OnInit {

  listaAlumnos: Alumno[] = [];
  loading: boolean = false;

  constructor(private _alumnoService: AlumnosService) { }

  ngOnInit(): void {
    this.getAlumnos();
  }

  getAlumnos() {
    this.loading = true;
    setTimeout(() => {
      this._alumnoService.getAlumnos().subscribe({
        next: (response) => {
          this.listaAlumnos = response;
          this.loading = false;
          console.log(response);
        },
        error: (err) => {
          console.error('Error fetching data', err);
        }
      });
    }, 1500);
  }

  deleteAlumno(id: number) {
    this._alumnoService.deleteAlumno(id).subscribe({
      next: (response) => {
        console.log('Alumno deleted', response);
        this.getAlumnos();
      },
      error: (err) => {
        console.error('Error deleting data', err);
      }
    });
  }


}
