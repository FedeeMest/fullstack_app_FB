import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../interfaces/alumno';
import { Router } from '@angular/router';
import { Inscripcion } from '../../../interfaces/inscripcion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css'] // Cambié de 'styleUrl' a 'styleUrls'
})
export class ResultadoComponent implements OnInit {
  alumno: Alumno| null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
      // Si no hay un alumno en el estado de navegación, intenta cargarlo de localStorage
    const storedAlumno = localStorage.getItem('alumno');
    if (storedAlumno) {
      this.alumno = JSON.parse(storedAlumno);
      console.log('Alumno cargado de localStorage:', this.alumno);
    } else {
      console.log('No se encontró el alumno en localStorage');
      this.router.navigate(['/buscar']); // Redirige si no hay alumno
    }
  }

  editarAlumno(id: number | undefined) {
    if (id !== undefined) {
      this.router.navigate(['/editar_alumno', id], { state: { from: 'resultado' } });
    } else {
      console.error('No se pudo obtener el ID del alumno');
    }
  }

  goBack() {
    localStorage.removeItem('alumno');
    this.router.navigate(['/buscar']);
  }
}