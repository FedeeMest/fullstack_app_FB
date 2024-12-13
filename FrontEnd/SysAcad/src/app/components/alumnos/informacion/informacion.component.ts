import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Alumno } from '../../../interfaces/alumno';
import { AlumnosService } from '../../../services/alumnos.service';

@Component({
  selector: 'app-informacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent implements OnInit {
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