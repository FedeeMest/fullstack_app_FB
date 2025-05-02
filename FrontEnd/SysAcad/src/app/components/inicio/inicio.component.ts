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
    if (typeof sessionStorage !== 'undefined') {
      const storedAlumno = sessionStorage.getItem('alumno');
      if (storedAlumno) {
        sessionStorage.removeItem('alumno');
        console.log('Alumno eliminado del sessionStorage');
        }
      }
  }

}
