import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlumnosService } from '../../../services/alumnos.service';
import { Inscripcion } from '../../../interfaces/inscripcion';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MateriaService } from '../../../services/materia.service';
import { EMPTY, filter, forkJoin, Observable, of } from 'rxjs';
import { Materia } from '../../../interfaces/materia';
import { Location } from '@angular/common';
import { InscripcionService } from '../../../services/inscripcion.service';

@Component({
  selector: 'app-listado-i',
  standalone: true,
  imports: [CommonModule,NgIf],
  templateUrl: './listado-i.component.html',
  styleUrl: './listado-i.component.css'
})
export class ListadoIComponent implements OnInit {
  alumnoId: number | null = null; // o el tipo correspondiente
  errorMessage: boolean = false; // Inicializa en false
  mensajeError: string = ''; // Inicializa como una cadena vacía
  inscripciones: Inscripcion[] = []; // Mantén solo inscripciones
  materiasNombres: { [id: number]: string } = {};

  constructor(private route: ActivatedRoute,private alumnoService: AlumnosService,private router: Router,private materiaService: MateriaService,private location: Location,private inscripcionService: InscripcionService) {}
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
                console.log('Inscripciones encontradas:', inscripciones);
                this.inscripciones = inscripciones; // Almacena las inscripciones tal como son
                this.loadMateriaNames(this.inscripciones); // Carga los nombres de las materias
            },
            error: (err) => {
                console.error('Error al obtener inscripciones:', err);
                if (err.status === 404) {
                    this.errorMessage = true;
                    this.mensajeError = 'No se encontraron inscripciones para este alumno.';
                } else {
                    this.errorMessage = true;
                    this.mensajeError = 'Hubo un error al obtener las inscripciones. Por favor, inténtalo de nuevo más tarde.';
                }
            }
        });
    }
}

loadMateriaNames(inscripciones: Inscripcion[]): void {
  const observables: Observable<Materia>[] = inscripciones.map(inscripcion => {
      const materiaId = typeof inscripcion.materia === 'number' 
          ? inscripcion.materia 
          : parseInt(inscripcion.materia as unknown as string, 10);
      
      if (isNaN(materiaId)) {
          console.warn(`materia_id no es un número válido:`, inscripcion.materia);
          return EMPTY; // Retorna un observable que completa sin emitir en caso de error
      }

      return this.materiaService.getMateria(materiaId);
  });

  forkJoin(observables).subscribe({
      next: (materias: (Materia | null)[]) => {
          // Llena el objeto de nombres de materias
          materias.forEach(materia => {
              if (materia && materia.id !== undefined) {
                  this.materiasNombres[materia.id] = materia.nombre;
              }
          });

          this.inscripciones = inscripciones; // Mantén la lista original
      },
      error: (err) => {
          console.error('Error al obtener nombres de materias:', err);
          this.errorMessage = true;
          this.mensajeError = 'Error al cargar los nombres de las materias.';
      },
  });
}




  deleteInscripcion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta inscripción?')) {
      this.inscripcionService.deleteInscripcion(id).subscribe({
        next: () => {
          console.log('Inscripción eliminada con éxito');
          this.getInscripciones();
        },
        error: (err) => {
          console.error('Error al eliminar inscripción:', err);
        },
      });
    }
  }

  goadd(){
    this.router.navigate(['/add_inscripcion']);
  }

  goBack() {
    this.location.back();
  }

}
