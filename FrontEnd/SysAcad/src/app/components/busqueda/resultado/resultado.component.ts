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
  alumno: Alumno & { inscripciones: Inscripcion[] } | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.alumno = navigation.extras.state['alumno']; // Obtiene el objeto alumno
    } else {
      this.router.navigate(['/buscar']); // Redirigir si no hay alumno
    }
  }

  goBack() {
    this.router.navigate(['/buscar']); // O la ruta que desees para volver
  }
}