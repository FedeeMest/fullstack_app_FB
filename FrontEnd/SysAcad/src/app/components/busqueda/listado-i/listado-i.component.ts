import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlumnosService } from '../../../services/alumnos.service';
import { Inscripcion } from '../../../interfaces/inscripcion';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-listado-i',
  standalone: true,
  imports: [CommonModule,NgIf],
  templateUrl: './listado-i.component.html',
  styleUrl: './listado-i.component.css'
})
export class ListadoIComponent implements OnInit {
  alumnoId: number | null = null; // o el tipo correspondiente
  inscripciones: Inscripcion[] = []; // Cambia el tipo a Inscripcion[]
  errorMessage: boolean = false; // Inicializa en false
  mensajeError: string = ''; // Inicializa como una cadena vacía

  constructor(private route: ActivatedRoute,private alumnoService: AlumnosService) {}
  ngOnInit():void{
    this.route.params.subscribe(params => {
      this.alumnoId = +params['id']; // Convertimos el id a número
      console.log('ID del alumno recibido:', this.alumnoId);
      // Aquí puedes hacer una consulta usando el alumnoId
      this.getInscripciones();
    });
  }

  getInscripciones(): void {
    if (this.alumnoId) {
      this.alumnoService.getInscripcionesByAlumnoId(this.alumnoId).subscribe({
        next: (inscripciones: Inscripcion[]) => {
          console.log('Inscripciones encontradas:', inscripciones); // Verifica si las inscripciones se encuentran
          this.inscripciones = inscripciones; // Almacena las inscripciones
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al obtener inscripciones:', err);
  
          // Manejo de errores específico
          if (err.status === 404) {
            this.errorMessage = true;
            this.mensajeError = 'No se encontraron inscripciones para este alumno.';
          } else {
            // Para cualquier otro error
            this.errorMessage = true;
            this.mensajeError = 'Hubo un error al obtener las inscripciones. Por favor, inténtalo de nuevo más tarde.';
          }
        }
      });
    }
  }

}
