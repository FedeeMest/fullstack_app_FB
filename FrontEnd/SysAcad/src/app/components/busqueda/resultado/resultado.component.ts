import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../interfaces/alumno';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {
  alumno: Alumno| null = null;

  constructor(private router: Router,private location: Location) {}

  ngOnInit(): void {
    const storedAlumno = localStorage.getItem('alumno');
    if (storedAlumno) {
      this.alumno = JSON.parse(storedAlumno);
      console.log('Alumno cargado de localStorage:', this.alumno);
    } else {
      console.log('No se encontró el alumno en localStorage');
      this.router.navigate(['/buscar']);
    }
  }

  editarAlumno(id: number | undefined) {
    if (id !== undefined) {
      this.router.navigate(['/editar_alumno', id], { state: { from: 'resultado' } });
    } else {
      console.error('No se pudo obtener el ID del alumno');
    }
  }

  verInscripciones(id: number | undefined) {
    if (id !== undefined) {
      this.router.navigate(['/lista_insc', id])
    } else {
      console.error('No se pudo obtener el ID del alumno');
    }
  }

  goBack() {
    this.location.back();
  }
}