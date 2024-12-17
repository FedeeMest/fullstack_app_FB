import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminbar',
  standalone: true,
  imports: [],
  templateUrl: './adminbar.component.html',
  styleUrl: './adminbar.component.css'
})
export class AdminbarComponent {

  constructor(private route:Router) { }
  
    goHome() {
      this.route.navigate(['/']);
    }
  
    goBuscar() {
      this.route.navigate(['/admin/buscar']);
    }
  
    goAlumnos() {
      this.route.navigate(['/admin/alumnos']);
    }
  
    goMaterias() {
      this.route.navigate(['/admin/materias']);
    }

    goAdmins() {
      this.route.navigate(['/admin/admins']);
    }

}
