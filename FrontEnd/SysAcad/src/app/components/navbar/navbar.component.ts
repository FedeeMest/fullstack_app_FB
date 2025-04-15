import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service.service';
import { CommonModule } from '@angular/common';
import { AlumnosService } from '../../services/alumnos.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isAdmin: boolean = false; // Variable para verificar si el usuario es admin
  nombre: string = ''; // Nombre del usuario
  apellido: string = ''; // Apellido del usuario
  usuario: string = ''; // Usuario

  constructor(
    private route: Router,
    private authService: AuthService,
    private alumnosService: AlumnosService,
    private adminService: AdminService
  ) {
    this.checkRole(); // Verificar el rol del usuario
    this.loadUserInfo(); // Cargar la información del usuario
  }

  checkRole() {
    const role = this.authService.getRole(); // Recuperar el rol del usuario
    this.isAdmin = role === 'admin'; // Verificar si el rol es admin
  }

  loadUserInfo() {
    const id = this.authService.getUserId(); // Recuperar el ID del usuario
    if (id === null) {
      console.error('El ID del usuario es null');
      return;
    }

    if (this.isAdmin) {
      this.adminService.getAdmin(id).subscribe(
        (admin) => {
          this.nombre = admin.nombre;
          this.apellido = admin.apellido;
          this.usuario = admin.usuario;
        },
        (error) => {
          console.error('Error al obtener los admins:', error);
        }
      );
    } else {
      this.alumnosService.getAlumno(id).subscribe(
        (alumno) => {
          this.nombre = alumno.nombre;
          this.apellido = alumno.apellido;
          this.usuario = alumno.usuario;
        },
        (error) => {
          console.error('Error al obtener los alumnos:', error);
        }
      );
    }
  }

  logout() {
    localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
    this.route.navigate(['/']); // Redirigir al login
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