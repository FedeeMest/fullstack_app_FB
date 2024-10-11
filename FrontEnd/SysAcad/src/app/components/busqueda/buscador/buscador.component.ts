import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumnosService } from '../../../services/alumnos.service';
import { Router } from '@angular/router';
import { Alumno } from '../../../interfaces/alumno';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css'
})
export class BuscadorComponent  {
  legajo: number |  null = null;;
  mensajeError: string | undefined;

  constructor(private alumnoService: AlumnosService, private router: Router, ) { }


  buscarAlumno(){
        if (this.legajo !== null) {
          this.alumnoService.buscarAlumnoPorLegajo(this.legajo).subscribe({
            next: (data: Alumno) => {
                // Si encuentra al alumno, redirige a la vista de detalles
                this.router.navigate(['/resultado', { alumno: JSON.stringify(data) }]);
                this.mensajeError = ''; // Limpia el mensaje de error
            },
            error: (error) => {
              // Si no encuentra al alumno, muestra un mensaje de error
              this.mensajeError = 'Alumno no encontrado'; 
          }
        })
    }
  }
}
