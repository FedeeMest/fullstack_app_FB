import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumnosService } from '../../../../services/alumnos.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';




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

  constructor(private fb: FormBuilder, private alumnoService: AlumnosService, private router: Router, private toastr: ToastrService) {
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
      console.log("Alumno encontrado:", alumno);
      if (alumno) {
        this.toastr.info('Mostrando la informacion del alumno solicitado', 'Alumno Encontrado', {
          progressBar: true,
          progressAnimation: 'decreasing'
        });
        this.router.navigate(['/admin/resultado/alumnos/'+ alumno.id]);
      } else {
        this.errorMessage = true;
        this.mensajeError = 'No se encontró un alumno con el legajo proporcionado.';
      }
    },
    error: (err) => {
      console.error('Error al buscar el alumno:', err);
      if (err.message.includes('El alumno no fue encontrado')) {
        this.errorMessage = true;
        this.mensajeError = 'No se encontró un alumno con el legajo proporcionado.';
      } else {
        this.errorMessage = true;
        this.mensajeError = 'Hubo un error al buscar el alumno. Por favor, inténtalo de nuevo más tarde.';
      }
    }
    });
  }
}
