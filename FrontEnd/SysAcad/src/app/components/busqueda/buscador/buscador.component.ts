import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumnosService } from '../../../services/alumnos.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css'
})
export class BuscadorComponent implements OnInit  {
  form: FormGroup;
  errorMessage: boolean = false;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnosService,
    private router: Router
  ) {
    this.form = this.fb.group({
      legajo: [null, [Validators.required, Validators.min(1)]]
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
}

  buscarAlumno() {
    console.log("Buscando alumno...");
  const legajo = this.form.value.legajo;

  this.alumnoService.getAlumnoByLegajo(legajo).subscribe({
    next: (alumno) => {
      console.log("Alumno encontrado:", alumno); // Verifica si el alumno se encuentra
      if (alumno) {
        // Almacena el alumno en localStorage antes de redirigir
        localStorage.setItem('alumno', JSON.stringify(alumno));
        this.router.navigate(['/resultado']);
      } else {
        this.errorMessage = true;
        this.mensajeError = 'No se encontró un alumno con el legajo proporcionado.';
      }
    },
      error: (err) => {
        console.error('Error al buscar el alumno:', err);
  
        // Si el error es 404, significa que no se encontró el alumno
        if (err.status === 404) {
          this.errorMessage = true;
          this.mensajeError = 'No se encontró ningún alumno con este legajo.';
        } else {
          // Para cualquier otro error
          this.errorMessage = true;
          this.mensajeError = 'Hubo un error al buscar el alumno. Por favor, inténtalo de nuevo más tarde.';
        }
      }
    });
  }
}
