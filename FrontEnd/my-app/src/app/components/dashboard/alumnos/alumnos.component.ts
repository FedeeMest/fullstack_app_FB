import { Component } from '@angular/core';
import { ListaalumnosComponent } from './listaalumnos/listaalumnos.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [NgFor,
    ListaalumnosComponent
  ],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.css'
})
export class AlumnosComponent {

}
