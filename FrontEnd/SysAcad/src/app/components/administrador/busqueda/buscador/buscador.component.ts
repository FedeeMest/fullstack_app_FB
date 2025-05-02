import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumnosService } from '../../../../services/alumnos.service'; // Servicio para interactuar con la API de alumnos
import { Router } from '@angular/router'; // Servicio para redirigir
import { CommonModule } from '@angular/common'; // Módulos comunes de Angular
import { ToastrService } from 'ngx-toastr'; // Servicio para mostrar notificaciones

@Component({
  selector: 'app-buscador', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [ReactiveFormsModule, CommonModule], // Módulos necesarios para el componente
  templateUrl: './buscador.component.html', // Ruta al archivo HTML del componente
  styleUrl: './buscador.component.css' // Ruta al archivo CSS del componente
})
export class BuscadorComponent implements OnInit {
  form: FormGroup; // Formulario reactivo para manejar el legajo del alumno
  errorMessage: boolean = false; // Indica si hay un error
  mensajeError: string = ''; // Mensaje de error para mostrar al usuario

  constructor(
    private fb: FormBuilder, // Constructor de formularios reactivos
    private alumnoService: AlumnosService, // Servicio para interactuar con la API de alumnos
    private router: Router, // Servicio para redirigir
    private toastr: ToastrService // Servicio para mostrar notificaciones
  ) {
    // Inicializar el formulario con validaciones
    this.form = this.fb.group({
      legajo: [null, [Validators.required, Validators.min(1)]] // Campo obligatorio y debe ser mayor a 0
    });
  }

  ngOnInit(): void {
    // Eliminar datos de alumno del sessionStorage si existen
    if (typeof sessionStorage !== 'undefined') {
      const storedAlumno = sessionStorage.getItem('alumno');
      if (storedAlumno) {
        sessionStorage.removeItem('alumno');
        console.log('Alumno eliminado del sessionStorage');
      }
    }
  }

  // Método para buscar un alumno por su legajo
  buscarAlumno(): void {
    console.log('Buscando alumno...');
    const legajo = this.form.value.legajo; // Obtener el legajo del formulario

    this.alumnoService.getAlumnoByLegajo(legajo).subscribe({
      next: (alumno) => {
        console.log('Alumno encontrado:', alumno);
        if (alumno) {
          // Mostrar notificación de éxito
          this.toastr.info('Mostrando la información del alumno solicitado', 'Alumno Encontrado', {
            progressBar: true,
            progressAnimation: 'decreasing'
          });
          // Redirigir a la página de resultados del alumno
          this.router.navigate(['/admin/resultado/alumnos/' + alumno.id]);
        } else {
          // Mostrar mensaje de error si no se encuentra el alumno
          this.errorMessage = true;
          this.mensajeError = 'No se encontró un alumno con el legajo proporcionado.';
        }
      },
      error: (err) => {
        console.error('Error al buscar el alumno:', err);
        if (err.message.includes('El alumno no fue encontrado')) {
          // Mostrar mensaje de error si el alumno no existe
          this.errorMessage = true;
          this.mensajeError = 'No se encontró un alumno con el legajo proporcionado.';
        } else {
          // Mostrar mensaje de error genérico
          this.errorMessage = true;
          this.mensajeError = 'Hubo un error al buscar el alumno. Por favor, inténtalo de nuevo más tarde.';
        }
      }
    });
  }
}