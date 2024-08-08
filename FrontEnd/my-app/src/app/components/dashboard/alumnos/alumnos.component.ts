import { Component } from '@angular/core';
import { ListaAlumnosComponent } from './listaalumnos/listaalumnos.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [NgFor,
    ListaAlumnosComponent
  ],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.css'
})
export class AlumnosComponent {

}
