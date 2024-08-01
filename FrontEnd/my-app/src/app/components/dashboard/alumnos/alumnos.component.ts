import { Component } from '@angular/core';
import { ListaalumnosComponent } from './listaalumnos/listaalumnos.component';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [
    ListaalumnosComponent
  ],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.css'
})
export class AlumnosComponent {

}
