import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../interfaces/alumno';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [],
  templateUrl: './resultado.component.html',
  styleUrl: './resultado.component.css'
})

export class ResultadoComponent implements OnInit {
  alumno!: Alumno | null; // Almacena los detalles del alumno

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
      // Obtiene el alumno pasado como parámetro
      const alumnoData = this.route.snapshot.paramMap.get('alumno');
      if (alumnoData) {
          this.alumno = JSON.parse(alumnoData); // Convierte la cadena JSON a objeto Alumno
      }
  }
}