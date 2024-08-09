import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../interfaces/alumno';
import { AlumnosService } from '../../services/alumnos.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [NgFor],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.css'
})
export class AlumnosComponent implements OnInit {

  listaAlumnos: Alumno[] = [];

  constructor(private _alumnoService: AlumnosService) { }

  ngOnInit(): void {
    this.getAlumnos();
  }

  getAlumnos() {
    this._alumnoService.getAlumnos().subscribe({
      next: (response) => {
        this.listaAlumnos = response;
        console.log(response);
      },
      error: (err) => {
        console.error('Error fetching data', err);
      }
    });
  }


}
