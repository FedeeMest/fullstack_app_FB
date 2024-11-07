import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent  implements OnInit {

  constructor() {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const storedAlumno = localStorage.getItem('alumno');
      if (storedAlumno) {
        localStorage.removeItem('alumno');
        console.log('Alumno eliminado del localStorage');
        }
      }
  }

}
