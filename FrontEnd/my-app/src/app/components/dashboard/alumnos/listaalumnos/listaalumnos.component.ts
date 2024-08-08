import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../../../service/service.service';
import { alumno } from '../../../../models/alumno';
import { NgFor } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-listaalumnos',
  standalone: true,
  imports: [NgFor],
  templateUrl: './listaalumnos.component.html',
  styleUrl: './listaalumnos.component.css'
})
export class ListaAlumnosComponent implements OnInit {

  items$: Observable<any[]>
  listadoAlumnos: any[] = [];

  constructor(private alumnoService: AlumnoService) { }

  ngOnInit(): void {
    this.alumnoService.getAlumnos().subscribe(
      (response) => {
        console.log("lista de alumbos:",response);
        this.listadoAlumnos = response;
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  
}
}
