import { Component, OnInit } from '@angular/core';
import { AlumnosService } from '../../../../service/alumnos.service';
import { Alumno } from '../../../../interfaces/alumno';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-listaalumnos',
  standalone: true,
  imports: [NgFor],
  templateUrl: './listaalumnos.component.html',
  styleUrl: './listaalumnos.component.css'
})
export class ListaalumnosComponent implements OnInit {
  listAlumnos: Alumno[] = [];

  constructor(private _alumnosService: AlumnosService) {}

  ngOnInit(): void {
    this.getListaAlumnos();
  }

  getListaAlumnos(){
    this._alumnosService.getListaAlumnos().subscribe((data) => {
      this.listAlumnos = data;
  });
  }
}
