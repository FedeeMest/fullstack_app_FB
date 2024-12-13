import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { EMPTY, filter, forkJoin, Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import {ToastrService } from 'ngx-toastr';
import { Inscripcion } from '../../../interfaces/inscripcion';
import { AlumnosService } from '../../../services/alumnos.service';
import { MateriaService } from '../../../services/materia.service';
import { InscripcionService } from '../../../services/inscripcion.service';
import { Materia } from '../../../interfaces/materia';


@Component({
  selector: 'app-listado-i',
  standalone: true,
  imports: [CommonModule,NgIf],
  templateUrl: './listado-i.component.html',
  styleUrl: './listado-i.component.css'
})
export class ListadoIComponent implements OnInit {
   alumnoId: number | null = null;
    errorMessage: boolean = false;
    mensajeError: string = '';
    inscripciones: Inscripcion[] = [];
    materiasNombres: { [id: number]: string } = {};

    constructor(private route: ActivatedRoute,private alumnoService: AlumnosService,private router: Router,private materiaService: MateriaService,private location: Location,private inscripcionService: InscripcionService, private toastr:ToastrService) {}
    ngOnInit():void{
      this.route.params.subscribe(params => {
        const id = +params['id'];
        if(!isNaN(id) && id > 0){
          this.alumnoId = id;
          console.log('ID del alumno recibido desde queryParams:', this.alumnoId);
          this.getInscripciones();
          } else {
            console.error('No se recibió un ID válido en los queryParams');
            this.goBack();
          }
      });
  }

  getInscripciones(): void {
    if (this.alumnoId) {
        this.alumnoService.getInscripcionesByAlumnoId(this.alumnoId).subscribe({
            next: (inscripciones: Inscripcion[]) => {
               console.log('Inscripciones encontradas:', inscripciones);
               this.inscripciones = inscripciones;
               this.loadMateriaNames(this.inscripciones);
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
            return EMPTY;
        }
        return this.materiaService.getMateria(materiaId);
    });
    forkJoin(observables).subscribe({
       next: (materias: (Materia | null)[]) => {
            materias.forEach(materia => {
               if (materia && materia.id !== undefined) {
                   this.materiasNombres[materia.id] = materia.nombre;
               }
           });
           this.inscripciones = inscripciones;
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
          this.toastr.error('La inscripción fue eliminada con éxito', 'Inscripción Eliminada',{
            progressBar: true,
            progressAnimation:'decreasing'
          });
         this.getInscripciones();
        },
        error: (err) => {
         console.error('Error al eliminar inscripción:', err);
        },
      });
    }
  }

  goadd(){
    this.router.navigate(['/add_inscripcion', this.alumnoId]);
  }

  goBack() {
    this.location.back();
  }

}
