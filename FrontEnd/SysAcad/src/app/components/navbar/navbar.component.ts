import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isAdmin: boolean = false; // Variable para verificar si el usuario es admin

  constructor(private route: Router, private authService: AuthService) {
    this.checkRole(); // Llamar a la función para verificar el rol al inicializar el componente
  }

  checkRole() {
    const role = this.authService.getRole(); // Recuperar el rol del usuario
    console.log(role);
    this.isAdmin = role === 'admin'; // Verificar si el rol es admin

  }

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