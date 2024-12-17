import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../../interfaces/alumno';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { AlumnosService } from '../../../../services/alumnos.service';
import { AdminbarComponent } from '../../../adminbar/adminbar.component.js';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [CommonModule, AdminbarComponent],
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {
  alumno: Alumno| null = null;

  constructor(private activatedroute:ActivatedRoute, private router: Router,private location: Location,private alumnosService: AlumnosService) {}

  ngOnInit(): void {
    this.activatedroute.params.subscribe((params) => {
      const alumnoId = +params['id'];
      if(alumnoId){
        this.alumnosService.getAlumno(alumnoId).subscribe({
          next: (alumno) => {
            this.alumno = alumno;
          },
          error: (err) => {
            console.error('Error al obtener los datos del alumno:', err);
            this.goBack()
          },
        });
      }
    });
  }

  editarAlumno(id: number | undefined) {
    if (id !== undefined) {
      this.router.navigate(['/admin/editar_alumno', id], { state: { from: 'resultado' } });
    } else {
      console.error('No se pudo obtener el ID del alumno');
    }
  }

  verInscripciones(id: number | undefined) {
    if (id !== undefined) {
      this.router.navigate(['/lista_insc', id]);
    } else {
      console.error('No se pudo obtener el ID del alumno');
    }
  }

  goBack() {
    this.location.back();
  }
}