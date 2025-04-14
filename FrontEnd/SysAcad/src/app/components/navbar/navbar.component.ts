import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private route:Router) { }

  goHome() {
    this.route.navigate(['/inicio']);
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
